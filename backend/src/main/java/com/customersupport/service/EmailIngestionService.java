package com.customersupport.service;

import com.customersupport.dto.SendGridInboundEvent;
import com.customersupport.entity.EmailMetadata;
import com.customersupport.entity.Message;
import com.customersupport.entity.Ticket;
import com.customersupport.enums.SenderType;
import com.customersupport.enums.TicketCategory;
import com.customersupport.enums.TicketStatus;
import com.customersupport.repository.EmailMetadataRepository;
import com.customersupport.repository.TicketRepository;
import com.customersupport.repository.MessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailIngestionService {
    private static final Logger logger = LoggerFactory.getLogger(EmailIngestionService.class);
    private final TicketRepository ticketRepository;
    private final MessageRepository messageRepository;
    private final EmailMetadataRepository emailMetadataRepository;

    public EmailIngestionService(TicketRepository ticketRepository,
                                 MessageRepository messageRepository,
                                 EmailMetadataRepository emailMetadataRepository) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        this.emailMetadataRepository = emailMetadataRepository;
    }

    @Transactional
    public Ticket processIncomingEmail(SendGridInboundEvent event) throws Exception {
        logger.info("Processing incoming email from: {} with subject: {}", event.from(), event.subject());

        // Check for duplicate using Message-ID
        if (event.messageId() != null) {
            Optional<EmailMetadata> existing = emailMetadataRepository.findByMessageIdHeader(event.messageId());
            if (existing.isPresent()) {
                logger.warn("Duplicate email detected with Message-ID: {}", event.messageId());
                return existing.get().getTicket();
            }
        }

        // Check if this is a reply to an existing ticket
        Ticket ticket;
        if (event.inReplyTo() != null) {
            Optional<EmailMetadata> parentMetadata = emailMetadataRepository.findByMessageIdHeader(event.inReplyTo());
            if (parentMetadata.isPresent()) {
                ticket = parentMetadata.get().getTicket();
                logger.info("Email is a reply to existing ticket ID: {}", ticket.getId());
            } else {
                ticket = createNewTicket(event);
            }
        } else {
            ticket = createNewTicket(event);
        }

        // Extract customer info
        String[] customerInfo = extractCustomerInfo(event.from());
        String customerName = customerInfo[0];
        String customerEmail = customerInfo[1];

        // Create message in existing ticket
        Message message = new Message();
        message.setTicket(ticket);
        message.setBody(event.text() != null ? event.text() : event.html());
        message.setSenderType(SenderType.CUSTOMER);
        message.setSenderName(customerName);
        message.setSentAt(event.timestamp() != null ?
            LocalDateTime.ofInstant(event.timestamp(), ZoneId.systemDefault()) :
            LocalDateTime.now());
        messageRepository.save(message);

        // Store email metadata for threading and deduplication
        if (event.messageId() != null) {
            EmailMetadata metadata = new EmailMetadata(
                ticket,
                event.messageId(),
                customerEmail,
                event.to(),
                event.subject(),
                event.inReplyTo()
            );
            emailMetadataRepository.save(metadata);
        }

        ticketRepository.save(ticket);

        logger.info("Successfully processed email. Ticket ID: {}", ticket.getId());
        return ticket;
    }

    private Ticket createNewTicket(SendGridInboundEvent event) {
        String[] customerInfo = extractCustomerInfo(event.from());
        String customerName = customerInfo[0];
        String customerEmail = customerInfo[1];

        // Auto-categorize based on subject and body
        TicketCategory category = detectTicketCategory(event.subject(), event.text());

        Ticket ticket = new Ticket();
        ticket.setTitle(event.subject() != null ? event.subject() : "Email from " + customerName);
        ticket.setDescription(event.text() != null ? event.text() : event.html());
        ticket.setStatus(TicketStatus.OPEN.name());
        ticket.setPriority("MEDIUM");
        ticket.setCategory(category.name());
        ticket.setCustomerName(customerName);
        ticket.setCustomerEmail(customerEmail);
        ticket.setSource("EMAIL");

        return ticketRepository.save(ticket);
    }

    public String[] extractCustomerInfo(String fromEmail) {
        // Parse "Name <email@domain.com>" or just "email@domain.com"
        Pattern pattern = Pattern.compile("^([^<]*)?\\s*<([^>]+)>|^([^<]+)$");
        Matcher matcher = pattern.matcher(fromEmail.trim());

        String name = null;
        String email = null;

        if (matcher.matches()) {
            if (matcher.group(2) != null) {
                // Found "Name <email>" format
                name = matcher.group(1) != null ? matcher.group(1).trim() : null;
                email = matcher.group(2);
            } else {
                // Just email format
                email = matcher.group(3);
            }
        } else {
            email = fromEmail;
        }

        // If no name extracted, use email prefix
        if (name == null || name.isEmpty()) {
            name = email.substring(0, email.indexOf('@'));
        }

        return new String[]{name, email};
    }

    public TicketCategory detectTicketCategory(String subject, String body) {
        String combined = (subject != null ? subject : "") + " " + (body != null ? body : "");
        String lower = combined.toLowerCase();

        if (lower.contains("billing") || lower.contains("invoice") || lower.contains("payment") || lower.contains("charge")) {
            return TicketCategory.BILLING;
        } else if (lower.contains("technical") || lower.contains("error") || lower.contains("bug") || lower.contains("broken")) {
            return TicketCategory.TECHNICAL;
        } else if (lower.contains("account") || lower.contains("password") || lower.contains("login") || lower.contains("profile")) {
            return TicketCategory.ACCOUNT;
        } else if (lower.contains("feature") || lower.contains("request") || lower.contains("suggestion")) {
            return TicketCategory.FEATURE_REQUEST;
        } else {
            return TicketCategory.GENERAL;
        }
    }

    public boolean verifyWebhookSignature(String signature, String timestamp, String body, String webhookToken) {
        // TODO: Implement SendGrid webhook signature verification
        // For now, return true for development
        // In production, use HMAC-SHA256 with the webhook token
        return true;
    }
}

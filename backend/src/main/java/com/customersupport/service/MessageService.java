package com.customersupport.service;

import com.customersupport.entity.Message;
import com.customersupport.entity.Ticket;
import com.customersupport.dto.MessageRequest;
import com.customersupport.dto.MessageResponse;
import com.customersupport.enums.SenderType;
import com.customersupport.repository.MessageRepository;
import com.customersupport.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final TicketRepository ticketRepository;

    public MessageService(MessageRepository messageRepository, TicketRepository ticketRepository) {
        this.messageRepository = messageRepository;
        this.ticketRepository = ticketRepository;
    }

    public List<MessageResponse> getMessagesByTicketId(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new RuntimeException("Ticket not found with id: " + ticketId);
        }
        List<Message> messages = messageRepository.findByTicketIdOrderBySentAtAsc(ticketId);
        return messages.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    public MessageResponse addMessage(Long ticketId, MessageRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));

        if (request.getBody() == null || request.getBody().trim().isEmpty()) {
            throw new IllegalArgumentException("Message body cannot be empty");
        }

        SenderType senderType = SenderType.fromValue(
            request.getSenderType() != null ? request.getSenderType() : "AGENT"
        );

        Message message = new Message();
        message.setTicket(ticket);
        message.setBody(request.getBody());
        message.setSenderType(senderType);
        message.setSenderName(request.getSenderName() != null ? request.getSenderName() : senderType.getDescription());

        Message saved = messageRepository.save(message);
        return convertToResponse(saved);
    }

    public MessageResponse deleteMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found with id: " + messageId));

        messageRepository.delete(message);
        return convertToResponse(message);
    }

    public List<MessageResponse> getMessagesByTicket(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new RuntimeException("Ticket not found with id: " + ticketId);
        }
        List<Message> messages = messageRepository.findByTicketId(ticketId);
        return messages.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    private MessageResponse convertToResponse(Message message) {
        return new MessageResponse(
            message.getId(),
            message.getTicket().getId(),
            message.getBody(),
            message.getSenderType(),
            message.getSenderName(),
            message.getSentAt()
        );
    }
}

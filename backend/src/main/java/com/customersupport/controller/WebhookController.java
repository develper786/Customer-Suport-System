package com.customersupport.controller;

import com.customersupport.dto.ApiResponse;
import com.customersupport.dto.SendGridInboundEvent;
import com.customersupport.entity.Ticket;
import com.customersupport.service.EmailIngestionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {
    private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);
    private final EmailIngestionService emailIngestionService;

    @Value("${email.ingestion.webhook-token:}")
    private String webhookToken;

    public WebhookController(EmailIngestionService emailIngestionService) {
        this.emailIngestionService = emailIngestionService;
    }

    @PostMapping("/email")
    public ResponseEntity<ApiResponse<Void>> handleEmailWebhook(@RequestBody SendGridInboundEvent event,
                                                                  @RequestHeader(value = "X-Twilio-Email-Event-Webhook-Signature", required = false) String signature,
                                                                  @RequestHeader(value = "X-Twilio-Email-Event-Webhook-Timestamp", required = false) String timestamp) {
        try {
            logger.info("Received email webhook from: {}", event.getFrom());

            // Verify webhook signature if token is configured
            if (webhookToken != null && !webhookToken.isEmpty()) {
                // TODO: Implement proper signature verification
                // For development, skip verification
                // boolean isValid = emailIngestionService.verifyWebhookSignature(signature, timestamp, body, webhookToken);
                // if (!isValid) {
                //     logger.error("Invalid webhook signature");
                //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                //         .body(new ApiResponse<>(false, "Invalid webhook signature", null));
                // }
            }

            // Process the email
            Ticket ticket = emailIngestionService.processIncomingEmail(event);

            logger.info("Successfully processed email. Ticket ID: {}", ticket.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Email processed successfully. Ticket ID: " + ticket.getId(), null));

        } catch (Exception e) {
            logger.error("Failed to process email webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to process email: " + e.getMessage(), null));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> webhookHealth() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Webhook endpoint is healthy", "Ready to receive SendGrid emails"));
    }
}

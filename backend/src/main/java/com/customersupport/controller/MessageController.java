package com.customersupport.controller;

import com.customersupport.dto.MessageRequest;
import com.customersupport.dto.MessageResponse;
import com.customersupport.dto.ApiResponse;
import com.customersupport.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class MessageController {

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getMessagesByTicket(
            @PathVariable Long ticketId) {
        try {
            List<MessageResponse> messages = messageService.getMessagesByTicketId(ticketId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Messages retrieved successfully", messages));
        } catch (RuntimeException e) {
            logger.warn("Ticket not found: {}", ticketId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Ticket not found"));
        } catch (Exception e) {
            logger.error("Error retrieving messages", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve messages"));
        }
    }

    @PostMapping("/ticket/{ticketId}")
    public ResponseEntity<ApiResponse<MessageResponse>> addMessage(
            @PathVariable Long ticketId,
            @RequestBody MessageRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (auth != null) ? auth.getName() : "unknown";

            MessageResponse message = messageService.addMessage(ticketId, request);
            logger.info("Message added to ticket: ID={}, by {}", ticketId, username);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Message added successfully", message));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid message request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, e.getMessage()));
        } catch (RuntimeException e) {
            logger.warn("Ticket not found: {}", ticketId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Ticket not found"));
        } catch (Exception e) {
            logger.error("Error adding message", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to add message"));
        }
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<MessageResponse>> deleteMessage(
            @PathVariable Long messageId) {
        try {
            MessageResponse message = messageService.deleteMessage(messageId);
            logger.info("Message deleted: ID={}", messageId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Message deleted successfully", message));
        } catch (RuntimeException e) {
            logger.warn("Message not found: {}", messageId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Message not found"));
        } catch (Exception e) {
            logger.error("Error deleting message", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to delete message"));
        }
    }
}

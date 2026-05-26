package com.customersupport.controller;

import com.customersupport.dto.TicketCreateRequest;
import com.customersupport.dto.TicketUpdateRequest;
import com.customersupport.dto.ApiResponse;
import com.customersupport.entity.Ticket;
import com.customersupport.service.TicketService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class TicketControllerV2 {

    private static final Logger logger = LoggerFactory.getLogger(TicketControllerV2.class);
    private final TicketService ticketService;

    public TicketControllerV2(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Ticket>>> getAllTickets() {
        try {
            List<Ticket> tickets = ticketService.getAllTickets();
            return ResponseEntity.ok(new ApiResponse<>(true, "Tickets retrieved successfully", tickets));
        } catch (Exception e) {
            logger.error("Error fetching tickets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve tickets"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getTicketById(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket retrieved successfully", ticket));
        } catch (RuntimeException e) {
            logger.warn("Ticket not found: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Ticket not found"));
        } catch (Exception e) {
            logger.error("Error fetching ticket", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve ticket"));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> createTicket(@RequestBody TicketCreateRequest request) {
        try {
            Ticket ticket = ticketService.createTicket(request);
            logger.info("Ticket created: ID={}, Title={}", ticket.getId(), ticket.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Ticket created successfully", ticket));
        } catch (Exception e) {
            logger.error("Error creating ticket", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to create ticket"));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketUpdateRequest request) {
        try {
            Ticket ticket = ticketService.updateTicket(id, request);
            logger.info("Ticket updated: ID={}", id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket updated successfully", ticket));
        } catch (RuntimeException e) {
            logger.warn("Ticket not found for update: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Ticket not found"));
        } catch (Exception e) {
            logger.error("Error updating ticket", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to update ticket"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable Long id) {
        try {
            ticketService.deleteTicket(id);
            logger.info("Ticket deleted: ID={}", id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Ticket deleted successfully"));
        } catch (RuntimeException e) {
            logger.warn("Ticket not found for deletion: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Ticket not found"));
        } catch (Exception e) {
            logger.error("Error deleting ticket", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to delete ticket"));
        }
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<ApiResponse<List<Ticket>>> getTicketsByStatus(@PathVariable String status) {
        try {
            List<Ticket> tickets = ticketService.getTicketsByStatus(status);
            return ResponseEntity.ok(new ApiResponse<>(true, "Tickets retrieved successfully", tickets));
        } catch (Exception e) {
            logger.error("Error fetching tickets by status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve tickets"));
        }
    }

}

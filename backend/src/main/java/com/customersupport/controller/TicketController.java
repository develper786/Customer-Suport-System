package com.customersupport.controller;

import com.customersupport.entity.Ticket;
import com.customersupport.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class TicketController {

    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        return ticketRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket) {
        Ticket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @RequestBody Ticket ticketUpdate) {
        return ticketRepository.findById(id)
            .map(ticket -> {
                if (ticketUpdate.getTitle() != null) ticket.setTitle(ticketUpdate.getTitle());
                if (ticketUpdate.getDescription() != null) ticket.setDescription(ticketUpdate.getDescription());
                if (ticketUpdate.getStatus() != null) ticket.setStatus(ticketUpdate.getStatus());
                if (ticketUpdate.getPriority() != null) ticket.setPriority(ticketUpdate.getPriority());
                if (ticketUpdate.getAssignedTo() != null) ticket.setAssignedTo(ticketUpdate.getAssignedTo());
                return ResponseEntity.ok(ticketRepository.save(ticket));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        ticketRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-status/{status}")
    public ResponseEntity<?> getTicketsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ticketRepository.findByStatus(status));
    }
}

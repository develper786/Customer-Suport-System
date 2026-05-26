package com.customersupport.service;

import com.customersupport.entity.Ticket;
import com.customersupport.dto.TicketCreateRequest;
import com.customersupport.dto.TicketUpdateRequest;
import com.customersupport.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(TicketCreateRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setPriority(request.priority() != null ? request.priority() : "MEDIUM");
        ticket.setCategory(request.category() != null ? request.category() : "GENERAL");
        ticket.setCustomerName(request.customerName());
        ticket.setCustomerEmail(request.customerEmail());
        ticket.setStatus("OPEN");
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Long id, TicketUpdateRequest request) {
        return ticketRepository.findById(id)
            .map(ticket -> {
                if (request.title() != null) ticket.setTitle(request.title());
                if (request.description() != null) ticket.setDescription(request.description());
                if (request.status() != null) ticket.setStatus(request.status());
                if (request.priority() != null) ticket.setPriority(request.priority());
                if (request.category() != null) ticket.setCategory(request.category());
                if (request.customerName() != null) ticket.setCustomerName(request.customerName());
                if (request.customerEmail() != null) ticket.setCustomerEmail(request.customerEmail());
                if (request.assignedTo() != null) {
                    // Note: Full user object assignment would require loading User entity
                    // For now, we skip assigning here as it's a separate concern
                }
                return ticketRepository.save(ticket);
            })
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByStatus(String status) {
        return ticketRepository.findByStatus(status);
    }

    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id: " + id);
        }
        ticketRepository.deleteById(id);
    }

}

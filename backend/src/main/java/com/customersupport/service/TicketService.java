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
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        ticket.setCategory(request.getCategory() != null ? request.getCategory() : "GENERAL");
        ticket.setCustomerName(request.getCustomerName());
        ticket.setCustomerEmail(request.getCustomerEmail());
        ticket.setStatus("OPEN");
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Long id, TicketUpdateRequest request) {
        return ticketRepository.findById(id)
            .map(ticket -> {
                if (request.getTitle() != null) ticket.setTitle(request.getTitle());
                if (request.getDescription() != null) ticket.setDescription(request.getDescription());
                if (request.getStatus() != null) ticket.setStatus(request.getStatus());
                if (request.getPriority() != null) ticket.setPriority(request.getPriority());
                if (request.getCategory() != null) ticket.setCategory(request.getCategory());
                if (request.getCustomerName() != null) ticket.setCustomerName(request.getCustomerName());
                if (request.getCustomerEmail() != null) ticket.setCustomerEmail(request.getCustomerEmail());
                if (request.getAssignedTo() != null) {
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

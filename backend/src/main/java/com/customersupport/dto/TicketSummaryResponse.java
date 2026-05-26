package com.customersupport.dto;

import com.customersupport.entity.Ticket;

public record TicketSummaryResponse(
    Long id,
    String title,
    String description,
    String status,
    String priority,
    String category,
    String customerName,
    String customerEmail,
    String createdAt,
    String updatedAt
) {
  public static TicketSummaryResponse from(Ticket ticket) {
    return new TicketSummaryResponse(
        ticket.getId(),
        ticket.getTitle(),
        ticket.getDescription(),
        ticket.getStatus(),
        ticket.getPriority(),
        ticket.getCategory(),
        ticket.getCustomerName(),
        ticket.getCustomerEmail(),
        ticket.getCreatedAt().toString(),
        ticket.getUpdatedAt().toString()
    );
  }
}

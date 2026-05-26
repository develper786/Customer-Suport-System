package com.customersupport.dto;

import java.util.List;
import com.customersupport.entity.Ticket;

public record TicketDetailResponse(
    Long id,
    String title,
    String description,
    String status,
    String priority,
    String category,
    String customerName,
    String customerEmail,
    String createdAt,
    String updatedAt,
    List<MessageResponse> messages
) {
  public static TicketDetailResponse from(Ticket ticket, List<MessageResponse> messages) {
    return new TicketDetailResponse(
        ticket.getId(),
        ticket.getTitle(),
        ticket.getDescription(),
        ticket.getStatus(),
        ticket.getPriority(),
        ticket.getCategory(),
        ticket.getCustomerName(),
        ticket.getCustomerEmail(),
        ticket.getCreatedAt().toString(),
        ticket.getUpdatedAt().toString(),
        messages
    );
  }
}

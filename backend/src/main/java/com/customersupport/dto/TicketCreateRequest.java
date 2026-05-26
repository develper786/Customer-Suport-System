package com.customersupport.dto;

public record TicketCreateRequest(
    String title,
    String description,
    String priority,
    String category,
    String customerName,
    String customerEmail
) {
  public TicketCreateRequest(String title, String description, String customerName, String customerEmail) {
    this(title, description, "MEDIUM", "GENERAL", customerName, customerEmail);
  }
}

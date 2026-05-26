package com.customersupport.dto;

public record TicketUpdateRequest(
    String title,
    String description,
    String status,
    String priority,
    String category,
    String customerName,
    String customerEmail,
    Long assignedTo
) {}

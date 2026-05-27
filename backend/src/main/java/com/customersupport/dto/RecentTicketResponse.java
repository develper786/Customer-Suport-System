package com.customersupport.dto;

import java.time.LocalDateTime;

public record RecentTicketResponse(
    Long id,
    String title,
    String status,
    String priority,
    String category,
    String customerName,
    LocalDateTime createdAt
) {}

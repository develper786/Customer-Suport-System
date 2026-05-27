package com.customersupport.dto;

public record ResponseTimeResponse(
    double averageFirstResponseHours,
    double averageResolutionHours
) {}

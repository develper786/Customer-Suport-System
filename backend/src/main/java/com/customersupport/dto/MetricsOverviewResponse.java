package com.customersupport.dto;

import java.util.Map;

public record MetricsOverviewResponse(
    long total,
    Map<String, Long> byStatus,
    Map<String, Long> byPriority,
    Map<String, Long> byCategory
) {}

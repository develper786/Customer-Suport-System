package com.customersupport.dto;

public record AIHandledResponse(
    long aiCount,
    long agentCount,
    double aiPercentage,
    double agentPercentage
) {}

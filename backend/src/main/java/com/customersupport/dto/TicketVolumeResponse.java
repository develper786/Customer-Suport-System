package com.customersupport.dto;

import java.util.List;

public record TicketVolumeResponse(
    String period,
    List<VolumePoint> data
) {}

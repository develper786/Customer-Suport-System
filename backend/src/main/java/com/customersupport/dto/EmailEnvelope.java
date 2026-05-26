package com.customersupport.dto;

import java.util.List;

public record EmailEnvelope(List<String> from, List<String> to) {}

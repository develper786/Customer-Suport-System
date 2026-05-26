package com.customersupport.dto;

import java.util.List;

public class EmailEnvelope {
    private List<String> from;
    private List<String> to;

    public EmailEnvelope() {}

    public List<String> getFrom() {
        return from;
    }

    public void setFrom(List<String> from) {
        this.from = from;
    }

    public List<String> getTo() {
        return to;
    }

    public void setTo(List<String> to) {
        this.to = to;
    }
}

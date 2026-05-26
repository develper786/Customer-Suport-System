package com.customersupport.dto;

public class TicketThreadRequest {
    private String message;
    private String senderName;

    private String senderType = "AGENT";

    public TicketThreadRequest() {}

    public TicketThreadRequest(String message, String senderName) {
        this.message = message;
        this.senderName = senderName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }
}

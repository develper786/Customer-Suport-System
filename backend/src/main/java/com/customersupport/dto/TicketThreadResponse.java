package com.customersupport.dto;

import java.time.LocalDateTime;

public class TicketThreadResponse {
    private Long id;
    private Long ticketId;
    private String sender;
    private String senderName;
    private String message;
    private LocalDateTime createdAt;

    public TicketThreadResponse() {}

    public TicketThreadResponse(Long id, Long ticketId, String sender, String senderName, String message, LocalDateTime createdAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.sender = sender;
        this.senderName = senderName;
        this.message = message;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

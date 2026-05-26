package com.customersupport.dto;

import java.time.LocalDateTime;
import com.customersupport.enums.SenderType;

public class MessageResponse {
    private Long id;
    private Long ticketId;
    private String body;
    private SenderType senderType;
    private String senderName;
    private LocalDateTime sentAt;

    public MessageResponse() {}

    public MessageResponse(Long id, Long ticketId, String body, SenderType senderType, String senderName, LocalDateTime sentAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.body = body;
        this.senderType = senderType;
        this.senderName = senderName;
        this.sentAt = sentAt;
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

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public SenderType getSenderType() {
        return senderType;
    }

    public void setSenderType(SenderType senderType) {
        this.senderType = senderType;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}

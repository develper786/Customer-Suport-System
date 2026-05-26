package com.customersupport.dto;

public class MessageRequest {
    private String body;
    private String senderType;
    private String senderName;

    public MessageRequest() {}

    public MessageRequest(String body, String senderType, String senderName) {
        this.body = body;
        this.senderType = senderType;
        this.senderName = senderName;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getSenderType() {
        return senderType;
    }

    public void setSenderType(String senderType) {
        this.senderType = senderType;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }
}

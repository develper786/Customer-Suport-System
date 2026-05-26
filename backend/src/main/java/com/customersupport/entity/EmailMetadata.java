package com.customersupport.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_metadata", indexes = {
    @Index(name = "idx_message_id", columnList = "message_id_header", unique = true),
    @Index(name = "idx_ticket_id", columnList = "ticket_id")
})
public class EmailMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Column(name = "message_id_header", unique = true)
    private String messageIdHeader;

    @Column(name = "from_email")
    private String fromEmail;

    @Column(name = "to_email")
    private String toEmail;

    @Column(name = "original_subject")
    private String originalSubject;

    @Column(name = "in_reply_to")
    private String inReplyTo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public EmailMetadata() {}

    public EmailMetadata(Ticket ticket, String messageIdHeader, String fromEmail, String toEmail, String originalSubject, String inReplyTo) {
        this.ticket = ticket;
        this.messageIdHeader = messageIdHeader;
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.originalSubject = originalSubject;
        this.inReplyTo = inReplyTo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public String getMessageIdHeader() {
        return messageIdHeader;
    }

    public void setMessageIdHeader(String messageIdHeader) {
        this.messageIdHeader = messageIdHeader;
    }

    public String getFromEmail() {
        return fromEmail;
    }

    public void setFromEmail(String fromEmail) {
        this.fromEmail = fromEmail;
    }

    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }

    public String getOriginalSubject() {
        return originalSubject;
    }

    public void setOriginalSubject(String originalSubject) {
        this.originalSubject = originalSubject;
    }

    public String getInReplyTo() {
        return inReplyTo;
    }

    public void setInReplyTo(String inReplyTo) {
        this.inReplyTo = inReplyTo;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

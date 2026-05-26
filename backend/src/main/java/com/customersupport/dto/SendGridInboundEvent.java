package com.customersupport.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.List;

public record SendGridInboundEvent(
    String from,
    String to,
    String subject,
    String text,
    String html,
    Instant timestamp,
    EmailEnvelope envelope,
    List<EmailAttachment> attachments,
    @JsonProperty("in_reply_to") String inReplyTo,
    @JsonProperty("message_id") String messageId
) {}

package com.customersupport.dto;

import java.time.LocalDateTime;
import com.customersupport.entity.Message;
import com.customersupport.enums.SenderType;

public record MessageResponse(
    Long id,
    Long ticketId,
    String body,
    SenderType senderType,
    String senderName,
    LocalDateTime sentAt
) {
  public static MessageResponse from(Message message) {
    return new MessageResponse(
        message.getId(),
        message.getTicket().getId(),
        message.getBody(),
        message.getSenderType(),
        message.getSenderName(),
        message.getSentAt()
    );
  }
}

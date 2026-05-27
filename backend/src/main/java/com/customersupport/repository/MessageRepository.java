package com.customersupport.repository;

import com.customersupport.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByTicketIdOrderBySentAtAsc(Long ticketId);
    List<Message> findByTicketId(Long ticketId);

    @Query("SELECT m.senderType, COUNT(DISTINCT m.ticket.id) FROM Message m GROUP BY m.senderType")
    List<Object[]> countTicketsBySourceType();
}

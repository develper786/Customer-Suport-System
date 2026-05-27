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

    @Query(value = "SELECT CAST(m.sender_type AS VARCHAR), COUNT(DISTINCT m.ticket_id) FROM messages m GROUP BY m.sender_type", nativeQuery = true)
    List<Object[]> countTicketsBySourceType();
}

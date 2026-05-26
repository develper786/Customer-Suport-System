package com.customersupport.repository;

import com.customersupport.entity.TicketThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ThreadRepository extends JpaRepository<TicketThread, Long> {
    List<TicketThread> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}

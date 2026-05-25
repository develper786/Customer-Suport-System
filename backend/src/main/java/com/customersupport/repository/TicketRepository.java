package com.customersupport.repository;

import com.customersupport.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByStatus(String status);
    List<Ticket> findByAssignedToId(Long userId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'OPEN'")
    long countOpenTickets();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'PENDING'")
    long countPendingTickets();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'RESOLVED'")
    long countResolvedTickets();
}

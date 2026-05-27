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
    List<Ticket> findTop5ByOrderByCreatedAtDesc();

    // Count methods for all statuses (Spring Data derived queries)
    long countByStatus(String status);
    long countByPriority(String priority);
    long countByCategory(String category);

    // Volume metrics (last 7 days daily breakdown)
    @Query("SELECT DATE(t.createdAt) as date, COUNT(t) as count FROM Ticket t " +
           "WHERE t.createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) " +
           "GROUP BY DATE(t.createdAt) ORDER BY DATE(t.createdAt)")
    List<Object[]> getLastSevenDaysVolume();

    // Volume metrics (last 4 weeks weekly breakdown)
    @Query("SELECT WEEK(t.createdAt) as week, COUNT(t) as count FROM Ticket t " +
           "WHERE t.createdAt >= DATE_SUB(CURDATE(), INTERVAL 28 DAY) " +
           "GROUP BY WEEK(t.createdAt) ORDER BY WEEK(t.createdAt)")
    List<Object[]> getLastFourWeeksVolume();

    // Response time: avg hours from creation to first agent response (resolved tickets only)
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, t.createdAt, " +
           "(SELECT MIN(m.sentAt) FROM Message m WHERE m.ticket.id = t.id AND m.senderType = 'AGENT'))) " +
           "FROM Ticket t WHERE t.status = 'RESOLVED'")
    Double getAverageFirstResponseTime();

    // Resolution time: avg hours from creation to resolvedAt timestamp
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, t.createdAt, t.resolvedAt)) " +
           "FROM Ticket t WHERE t.resolvedAt IS NOT NULL")
    Double getAverageResolutionTime();

    // Legacy hardcoded queries (keep for backward compatibility)
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'OPEN'")
    long countOpenTickets();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'PENDING'")
    long countPendingTickets();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'RESOLVED'")
    long countResolvedTickets();
}

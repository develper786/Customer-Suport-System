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

    // Volume metrics (last 7 days daily breakdown) - using CAST to date
    @Query(value = "SELECT CAST(t.created_at AS DATE) as date, COUNT(t.id) as count FROM tickets t " +
           "WHERE t.created_at >= CURRENT_DATE - INTERVAL '7 days' " +
           "GROUP BY CAST(t.created_at AS DATE) ORDER BY CAST(t.created_at AS DATE)", nativeQuery = true)
    List<Object[]> getLastSevenDaysVolume();

    // Volume metrics (last 4 weeks weekly breakdown)
    @Query(value = "SELECT EXTRACT(WEEK FROM t.created_at) as week, COUNT(t.id) as count FROM tickets t " +
           "WHERE t.created_at >= CURRENT_DATE - INTERVAL '28 days' " +
           "GROUP BY EXTRACT(WEEK FROM t.created_at) ORDER BY EXTRACT(WEEK FROM t.created_at)", nativeQuery = true)
    List<Object[]> getLastFourWeeksVolume();

    // Response time: avg hours from creation to first agent response (resolved tickets only)
    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (SELECT MIN(m.sent_at) FROM messages m WHERE m.ticket_id = t.id AND m.sender_type = 'AGENT') - t.created_at) / 3600.0) " +
           "FROM tickets t WHERE t.status = 'RESOLVED'", nativeQuery = true)
    Double getAverageFirstResponseTime();

    // Resolution time: avg hours from creation to resolvedAt timestamp
    @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (t.resolved_at - t.created_at)) / 3600.0) " +
           "FROM tickets t WHERE t.resolved_at IS NOT NULL", nativeQuery = true)
    Double getAverageResolutionTime();

    // Legacy hardcoded queries (keep for backward compatibility)
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'OPEN'")
    long countOpenTickets();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'PENDING'")
    long countPendingTickets();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 'RESOLVED'")
    long countResolvedTickets();
}

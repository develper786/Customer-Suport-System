package com.customersupport.service;

import com.customersupport.dto.*;
import com.customersupport.repository.MessageRepository;
import com.customersupport.repository.TicketRepository;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@EnableScheduling
public class MetricsCache {
    private final TicketRepository ticketRepository;
    private final MessageRepository messageRepository;

    private volatile MetricsOverviewResponse overview;
    private volatile TicketVolumeResponse volumeTrend;
    private volatile AIHandledResponse aiRatio;
    private volatile ResponseTimeResponse responseTime;
    private volatile List<RecentTicketResponse> recentTickets;

    public MetricsCache(TicketRepository ticketRepository, MessageRepository messageRepository) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
        // Initialize on startup
        refreshMetrics();
    }

    @Scheduled(fixedRate = 300000) // 5 minutes
    public void refreshMetrics() {
        refreshOverview();
        refreshVolumeTrend();
        refreshAIRatio();
        refreshResponseTime();
        refreshRecentTickets();
    }

    private void refreshOverview() {
        long total = ticketRepository.count();
        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("OPEN", ticketRepository.countByStatus("OPEN"));
        byStatus.put("AI_RESPONDED", ticketRepository.countByStatus("AI_RESPONDED"));
        byStatus.put("PENDING_HUMAN", ticketRepository.countByStatus("PENDING_HUMAN"));
        byStatus.put("IN_PROGRESS", ticketRepository.countByStatus("IN_PROGRESS"));
        byStatus.put("RESOLVED", ticketRepository.countByStatus("RESOLVED"));

        Map<String, Long> byPriority = new HashMap<>();
        byPriority.put("HIGH", ticketRepository.countByPriority("HIGH"));
        byPriority.put("MEDIUM", ticketRepository.countByPriority("MEDIUM"));
        byPriority.put("LOW", ticketRepository.countByPriority("LOW"));

        Map<String, Long> byCategory = new HashMap<>();
        byCategory.put("BILLING", ticketRepository.countByCategory("BILLING"));
        byCategory.put("TECHNICAL", ticketRepository.countByCategory("TECHNICAL"));
        byCategory.put("ACCOUNT", ticketRepository.countByCategory("ACCOUNT"));
        byCategory.put("FEATURE_REQUEST", ticketRepository.countByCategory("FEATURE_REQUEST"));
        byCategory.put("GENERAL", ticketRepository.countByCategory("GENERAL"));

        this.overview = new MetricsOverviewResponse(total, byStatus, byPriority, byCategory);
    }

    private void refreshVolumeTrend() {
        List<Object[]> rawData = ticketRepository.getLastSevenDaysVolume();
        List<VolumePoint> data = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        for (Object[] row : rawData) {
            LocalDate date = (LocalDate) row[0];
            long count = ((Number) row[1]).longValue();
            data.add(new VolumePoint(date.format(formatter), count));
        }

        this.volumeTrend = new TicketVolumeResponse("daily", data);
    }

    private void refreshAIRatio() {
        List<Object[]> rawData = messageRepository.countTicketsBySourceType();
        long aiCount = 0;
        long agentCount = 0;
        long customerCount = 0;

        for (Object[] row : rawData) {
            String senderType = (String) row[0];
            long count = ((Number) row[1]).longValue();

            if ("AI".equals(senderType)) {
                aiCount = count;
            } else if ("AGENT".equals(senderType)) {
                agentCount = count;
            } else if ("CUSTOMER".equals(senderType)) {
                customerCount = count;
            }
        }

        // Calculate percentages (handled by agents or AI, excluding customers)
        long handled = aiCount + agentCount;
        double aiPercentage = handled > 0 ? (aiCount * 100.0) / handled : 0;
        double agentPercentage = handled > 0 ? (agentCount * 100.0) / handled : 0;

        this.aiRatio = new AIHandledResponse(aiCount, agentCount, aiPercentage, agentPercentage);
    }

    private void refreshResponseTime() {
        Double avgFirstResponse = ticketRepository.getAverageFirstResponseTime();
        Double avgResolution = ticketRepository.getAverageResolutionTime();

        this.responseTime = new ResponseTimeResponse(
            avgFirstResponse != null ? avgFirstResponse : 0.0,
            avgResolution != null ? avgResolution : 0.0
        );
    }

    private void refreshRecentTickets() {
        this.recentTickets = ticketRepository.findTop5ByOrderByCreatedAtDesc().stream()
            .map(ticket -> new RecentTicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCategory(),
                ticket.getCustomerName(),
                ticket.getCreatedAt()
            ))
            .toList();
    }

    // Getters
    public MetricsOverviewResponse getOverview() {
        return overview;
    }

    public TicketVolumeResponse getVolumeTrend() {
        return volumeTrend;
    }

    public AIHandledResponse getAIRatio() {
        return aiRatio;
    }

    public ResponseTimeResponse getResponseTime() {
        return responseTime;
    }

    public List<RecentTicketResponse> getRecentTickets() {
        return recentTickets;
    }

    // Manual refresh
    public void refreshNow() {
        refreshMetrics();
    }
}

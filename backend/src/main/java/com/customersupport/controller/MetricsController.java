package com.customersupport.controller;

import com.customersupport.dto.*;
import com.customersupport.service.MetricsCache;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class MetricsController {

    private final MetricsCache metricsCache;

    public MetricsController(MetricsCache metricsCache) {
        this.metricsCache = metricsCache;
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<MetricsOverviewResponse>> getOverview() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Metrics overview", metricsCache.getOverview()));
    }

    @GetMapping("/volume-trend")
    public ResponseEntity<ApiResponse<TicketVolumeResponse>> getVolumeTrend(@RequestParam(defaultValue = "daily") String period) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Volume trend", metricsCache.getVolumeTrend()));
    }

    @GetMapping("/ai-ratio")
    public ResponseEntity<ApiResponse<AIHandledResponse>> getAIRatio() {
        return ResponseEntity.ok(new ApiResponse<>(true, "AI vs agent handled ratio", metricsCache.getAIRatio()));
    }

    @GetMapping("/response-time")
    public ResponseEntity<ApiResponse<ResponseTimeResponse>> getResponseTime() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Response time metrics", metricsCache.getResponseTime()));
    }

    @GetMapping("/recent-tickets")
    public ResponseEntity<ApiResponse<java.util.List<RecentTicketResponse>>> getRecentTickets() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Recent tickets", metricsCache.getRecentTickets()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refreshMetrics() {
        metricsCache.refreshNow();
        return ResponseEntity.ok(new ApiResponse<>(true, "Metrics refreshed successfully", "Metrics refreshed"));
    }

    // Legacy endpoints (kept for backward compatibility)
    @GetMapping("/volume")
    public ResponseEntity<?> getVolume(@RequestParam(defaultValue = "day") String period) {
        MetricsOverviewResponse overview = metricsCache.getOverview();
        Map<String, Object> volume = new HashMap<>();
        volume.put("period", period);
        volume.put("count", overview.total());
        volume.put("average_per_day", overview.total() > 0 ? overview.total() / 7 : 0);
        return ResponseEntity.ok(volume);
    }

    @GetMapping("/response-times")
    public ResponseEntity<?> getResponseTimes() {
        ResponseTimeResponse times = metricsCache.getResponseTime();
        Map<String, Object> result = new HashMap<>();
        result.put("average_first_response", String.format("%.1f hours", times.averageFirstResponseHours()));
        result.put("average_resolution", String.format("%.1f hours", times.averageResolutionHours()));
        result.put("p95", "4 hours");
        return ResponseEntity.ok(result);
    }

    @GetMapping("/resolution")
    public ResponseEntity<?> getResolution() {
        MetricsOverviewResponse overview = metricsCache.getOverview();
        Map<String, Object> resolution = new HashMap<>();
        resolution.put("this_month", overview.byStatus().getOrDefault("RESOLVED", 0L));
        resolution.put("this_week", 5);
        resolution.put("today", 2);
        return ResponseEntity.ok(resolution);
    }
}

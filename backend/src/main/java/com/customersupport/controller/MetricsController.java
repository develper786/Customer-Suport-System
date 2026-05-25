package com.customersupport.controller;

import com.customersupport.repository.TicketRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class MetricsController {

    private final TicketRepository ticketRepository;

    public MetricsController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        Map<String, Object> metrics = new HashMap<>();

        long totalTickets = ticketRepository.count();
        long openTickets = ticketRepository.countOpenTickets();
        long pendingTickets = ticketRepository.countPendingTickets();
        long resolvedTickets = ticketRepository.countResolvedTickets();

        metrics.put("total", totalTickets);
        metrics.put("open", openTickets);
        metrics.put("pending", pendingTickets);
        metrics.put("resolved", resolvedTickets);
        metrics.put("resolution_rate", totalTickets > 0 ? ((double) resolvedTickets / totalTickets) * 100 : 0);

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/volume")
    public ResponseEntity<?> getVolume(@RequestParam(defaultValue = "day") String period) {
        Map<String, Object> volume = new HashMap<>();
        long total = ticketRepository.count();

        volume.put("period", period);
        volume.put("count", total);
        volume.put("average_per_day", total > 0 ? total / 7 : 0);

        return ResponseEntity.ok(volume);
    }

    @GetMapping("/response-times")
    public ResponseEntity<?> getResponseTimes() {
        Map<String, Object> times = new HashMap<>();
        times.put("average_first_response", "2 hours");
        times.put("average_resolution", "24 hours");
        times.put("p95", "4 hours");
        return ResponseEntity.ok(times);
    }

    @GetMapping("/resolution")
    public ResponseEntity<?> getResolution() {
        Map<String, Object> resolution = new HashMap<>();
        resolution.put("this_month", ticketRepository.countResolvedTickets());
        resolution.put("this_week", 5);
        resolution.put("today", 2);
        return ResponseEntity.ok(resolution);
    }
}

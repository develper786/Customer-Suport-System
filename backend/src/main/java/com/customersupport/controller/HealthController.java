package com.customersupport.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class HealthController {

    @GetMapping
    public ResponseEntity<?> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("message", "⚡ Frontend UI is working! Auto-restart successful!");
        health.put("timestamp", LocalDateTime.now());
        health.put("version", "1.1.0");
        health.put("database", "PostgreSQL");
        health.put("uptime", "Active");
        health.put("devtools_enabled", true);

        return ResponseEntity.ok(health);
    }

    @GetMapping("/info")
    public ResponseEntity<?> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("app_name", "Customer Support Management System");
        info.put("version", "1.0.0");
        info.put("status", "Running");
        info.put("environment", "Development");
        info.put("timestamp", LocalDateTime.now());
        info.put("java_version", System.getProperty("java.version"));
        info.put("os_name", System.getProperty("os.name"));

        return ResponseEntity.ok(info);
    }
}

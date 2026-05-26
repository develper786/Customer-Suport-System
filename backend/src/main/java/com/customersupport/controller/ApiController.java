package com.customersupport.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping
    public ResponseEntity<?> welcome() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "running");
        response.put("message", "Customer Support API");
        response.put("version", "1.0.0");
        response.put("endpoints", new Object[]{
            "/api/me",
            "/api/auth/login",
            "/api/auth/logout",
            "/api/auth/me",
            "/actuator/health"
        });
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
            Map<String, Object> response = new HashMap<>();
            response.put("username", authentication.getName());
            response.put("roles", authentication.getAuthorities());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

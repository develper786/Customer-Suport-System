package com.customersupport.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CsrfController {

    @GetMapping("/csrf-token")
    public ResponseEntity<?> getCsrfToken(CsrfToken token) {
        Map<String, String> response = new HashMap<>();
        response.put("token", token.getToken());
        response.put("headerName", token.getHeaderName());
        response.put("parameterName", token.getParameterName());
        return ResponseEntity.ok(response);
    }
}

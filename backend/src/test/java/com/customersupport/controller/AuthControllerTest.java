package com.customersupport.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void loginWithValidCredentials_returns200() throws Exception {
    String loginPayload = """
        {
          "username": "admin",
          "password": "admin123"
        }
        """;

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(loginPayload)
        .with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.username").value("admin"))
        .andExpect(jsonPath("$.message").value("Login successful"));
  }

  @Test
  void loginWithWrongPassword_returns400() throws Exception {
    String loginPayload = """
        {
          "username": "admin",
          "password": "wrongpassword"
        }
        """;

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(loginPayload)
        .with(csrf()))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").value("Invalid username or password"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void logoutWithAuth_returns200() throws Exception {
    mockMvc.perform(post("/api/auth/logout")
        .with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true))
        .andExpect(jsonPath("$.message").value("Logout successful"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void getMeWithAuth_returns200() throws Exception {
    mockMvc.perform(get("/api/auth/me"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.username").value("admin"))
        .andExpect(jsonPath("$.roles").isArray());
  }
}

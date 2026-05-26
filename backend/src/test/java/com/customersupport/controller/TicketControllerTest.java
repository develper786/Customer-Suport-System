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

import com.customersupport.entity.Ticket;
import com.customersupport.repository.TicketRepository;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TicketControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private TicketRepository ticketRepository;

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void getAllTickets_withAuth_returns200AndArray() throws Exception {
    mockMvc.perform(get("/api/tickets"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", isA(java.util.ArrayList.class)));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void createTicket_withAuth_returns200WithId() throws Exception {
    String ticketPayload = """
        {
          "title": "Test Ticket",
          "description": "Test Description",
          "customerEmail": "test@example.com",
          "customerName": "Test User"
        }
        """;

    mockMvc.perform(post("/api/tickets")
        .contentType(MediaType.APPLICATION_JSON)
        .content(ticketPayload)
        .with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").isNumber())
        .andExpect(jsonPath("$.title").value("Test Ticket"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void getTicketById_notFound_returns404() throws Exception {
    mockMvc.perform(get("/api/tickets/99999"))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void updateTicket_changesStatus() throws Exception {
    // Create a ticket first
    Ticket ticket = new Ticket("Update Test", "Test", "test@example.com", "Test User");
    ticket = ticketRepository.save(ticket);
    Long ticketId = ticket.getId();

    String updatePayload = """
        {
          "status": "RESOLVED"
        }
        """;

    mockMvc.perform(patch("/api/tickets/" + ticketId)
        .contentType(MediaType.APPLICATION_JSON)
        .content(updatePayload)
        .with(csrf()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(ticketId.intValue()))
        .andExpect(jsonPath("$.status").value("RESOLVED"));
  }

  @Test
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void deleteTicket_returns200() throws Exception {
    // Create a ticket first
    Ticket ticket = new Ticket("Delete Test", "Test", "test@example.com", "Test User");
    ticket = ticketRepository.save(ticket);
    Long ticketId = ticket.getId();

    mockMvc.perform(delete("/api/tickets/" + ticketId)
        .with(csrf()))
        .andExpect(status().isOk());

    // Verify ticket is deleted
    mockMvc.perform(get("/api/tickets/" + ticketId))
        .andExpect(status().isNotFound());
  }
}

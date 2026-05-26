package com.customersupport.config;

import com.customersupport.entity.User;
import com.customersupport.entity.Ticket;
import com.customersupport.repository.UserRepository;
import com.customersupport.repository.TicketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(
            UserRepository userRepository,
            TicketRepository ticketRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user already exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                // Create admin user
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole("ROLE_ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println("✓ Admin user created (username: admin, password: admin123)");

                // Create sample support agent
                User agent = new User();
                agent.setUsername("support");
                agent.setPassword(passwordEncoder.encode("support123"));
                agent.setRole("ROLE_AGENT");
                agent.setEnabled(true);
                userRepository.save(agent);
                System.out.println("✓ Support agent created (username: support, password: support123)");

                // Create sample tickets
                Ticket ticket1 = new Ticket("Login not working", "Cannot login with credentials", "customer1@example.com", "John Doe");
                ticket1.setStatus("OPEN");
                ticket1.setPriority("HIGH");
                ticket1.setAssignedTo(agent);
                ticketRepository.save(ticket1);

                Ticket ticket2 = new Ticket("Password reset issue", "Password reset link not received", "customer2@example.com", "Jane Smith");
                ticket2.setStatus("PENDING");
                ticket2.setPriority("MEDIUM");
                ticket2.setAssignedTo(agent);
                ticketRepository.save(ticket2);

                Ticket ticket3 = new Ticket("Account deletion request", "Want to delete my account", "customer3@example.com", "Bob Johnson");
                ticket3.setStatus("RESOLVED");
                ticket3.setPriority("LOW");
                ticket3.setAssignedTo(admin);
                ticketRepository.save(ticket3);

                System.out.println("✓ Sample tickets created");
            }
        };
    }
}

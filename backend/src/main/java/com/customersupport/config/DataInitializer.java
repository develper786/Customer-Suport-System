package com.customersupport.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.customersupport.entity.Ticket;
import com.customersupport.entity.Message;
import com.customersupport.entity.User;
import com.customersupport.enums.SenderType;
import com.customersupport.repository.TicketRepository;
import com.customersupport.repository.MessageRepository;
import com.customersupport.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(
            UserRepository userRepository,
            TicketRepository ticketRepository,
            MessageRepository messageRepository,
            PasswordEncoder passwordEncoder,
            DefaultCredentialsProperties credentialsProperties) {
        return args -> initializeDatabaseWithTransactionManagement(
                userRepository,
                ticketRepository,
                messageRepository,
                passwordEncoder,
                credentialsProperties);
    }

    @Transactional
    private void initializeDatabaseWithTransactionManagement(
            UserRepository userRepository,
            TicketRepository ticketRepository,
            MessageRepository messageRepository,
            PasswordEncoder passwordEncoder,
            DefaultCredentialsProperties credentialsProperties) {

        try {
            // Check if admin user already exists
            if (userRepository.findByUsername(credentialsProperties.getAdmin().getUsername()).isEmpty()) {

                // Create admin user from properties
                User admin = new User();
                admin.setUsername(credentialsProperties.getAdmin().getUsername());
                admin.setPassword(passwordEncoder.encode(credentialsProperties.getAdmin().getPassword()));
                admin.setRole(credentialsProperties.getAdmin().getRole());
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println("✓ Admin user created (username: " + admin.getUsername() + ")");

                // Create support agent from properties
                User support = new User();
                support.setUsername(credentialsProperties.getSupport().getUsername());
                support.setPassword(passwordEncoder.encode(credentialsProperties.getSupport().getPassword()));
                support.setRole(credentialsProperties.getSupport().getRole());
                support.setEnabled(true);
                userRepository.save(support);
                System.out.println("✓ Support agent created (username: " + support.getUsername() + ")");

                // Create sample tickets with thread messages
                Ticket ticket1 = new Ticket("Login not working", "Cannot login with credentials", "customer1@example.com", "John Doe");
                ticket1.setStatus("PENDING_HUMAN");
                ticket1.setPriority("HIGH");
                ticket1.setCategory("ACCOUNT");
                ticket1.setAssignedTo(support);
                Ticket saved1 = ticketRepository.save(ticket1);

                // Add sample messages for ticket1
                messageRepository.save(new Message(saved1, "I can't login with my credentials. I've tried resetting my password but it's not working.", SenderType.CUSTOMER, "John Doe"));
                messageRepository.save(new Message(saved1, "Hi John, thank you for reaching out. Could you please provide the email address associated with your account?", SenderType.AGENT, "Support Team"));

                Ticket ticket2 = new Ticket("Password reset issue", "Password reset link not received", "customer2@example.com", "Jane Smith");
                ticket2.setStatus("AI_RESPONDED");
                ticket2.setPriority("MEDIUM");
                ticket2.setCategory("ACCOUNT");
                ticket2.setAssignedTo(support);
                Ticket saved2 = ticketRepository.save(ticket2);

                // Add sample messages for ticket2
                messageRepository.save(new Message(saved2, "I requested a password reset but I'm not receiving the email link.", SenderType.CUSTOMER, "Jane Smith"));
                messageRepository.save(new Message(saved2, "Jane, we've checked and the reset link was sent. Please check your spam folder and try requesting a new link.", SenderType.AGENT, "Support Team"));

                Ticket ticket3 = new Ticket("Account deletion request", "Want to delete my account", "customer3@example.com", "Bob Johnson");
                ticket3.setStatus("RESOLVED");
                ticket3.setPriority("LOW");
                ticket3.setCategory("ACCOUNT");
                ticket3.setAssignedTo(admin);
                Ticket saved3 = ticketRepository.save(ticket3);

                // Add sample messages for ticket3
                messageRepository.save(new Message(saved3, "I would like to request permanent deletion of my account.", SenderType.CUSTOMER, "Bob Johnson"));
                messageRepository.save(new Message(saved3, "Bob, we've processed your request. Your account will be deleted within 30 days as per our policy.", SenderType.AGENT, "Support Team"));
                messageRepository.save(new Message(saved3, "Account deletion completed successfully.", SenderType.AGENT, "Support Team"));

                System.out.println("✓ Sample tickets created");
                System.out.println("✓ Sample ticket messages created");
            }
        } catch (Exception e) {
            System.err.println("Error during data initialization: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}

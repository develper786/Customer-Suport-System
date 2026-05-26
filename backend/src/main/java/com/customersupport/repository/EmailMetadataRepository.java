package com.customersupport.repository;

import com.customersupport.entity.EmailMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailMetadataRepository extends JpaRepository<EmailMetadata, Long> {
    Optional<EmailMetadata> findByMessageIdHeader(String messageIdHeader);
    Optional<EmailMetadata> findByInReplyTo(String inReplyTo);
}

<<<<<<< HEAD
package com.mecanosfera.nomos.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByEmailIgnoreCase(String email);
    int deleteByExpiraEnBefore(LocalDateTime instante);
=======
package com.mecanosfera.nomos.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByEmailIgnoreCase(String email);
    int deleteByExpiraEnBefore(LocalDateTime instante);
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}
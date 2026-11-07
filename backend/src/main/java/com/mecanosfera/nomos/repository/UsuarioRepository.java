<<<<<<< HEAD
package com.mecanosfera.nomos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);
=======
package com.mecanosfera.nomos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mecanosfera.nomos.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<Usuario> findByRecibirNovedadesTrue();
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}
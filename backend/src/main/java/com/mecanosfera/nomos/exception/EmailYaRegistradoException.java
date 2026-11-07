<<<<<<< HEAD
package com.mecanosfera.nomos.exception;

public class EmailYaRegistradoException extends RuntimeException {
    public EmailYaRegistradoException(String email) {
        super("Ya existe una cuenta registrada con el email: " + email);
    }
=======
package com.mecanosfera.nomos.exception;

public class EmailYaRegistradoException extends RuntimeException {
    public EmailYaRegistradoException(String email) {
        super("Ya existe una cuenta registrada con el email: " + email);
    }
>>>>>>> 40ba4cc8b7a8079df02ef3c3c0534468ff47d7b9
}
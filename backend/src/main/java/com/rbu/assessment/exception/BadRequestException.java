package com.rbu.assessment.exception;

// Exception thrown when business logic validation fails
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

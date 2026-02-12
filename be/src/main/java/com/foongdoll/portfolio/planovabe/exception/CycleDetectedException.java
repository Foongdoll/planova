package com.foongdoll.portfolio.planovabe.exception;

public class CycleDetectedException extends RuntimeException {
    public CycleDetectedException(String message) {
        super(message);
    }
}

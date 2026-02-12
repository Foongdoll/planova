package com.foongdoll.portfolio.planovabe.controller;

import com.foongdoll.portfolio.planovabe.dto.request.LoginRequest;
import com.foongdoll.portfolio.planovabe.dto.request.SignupRequest;
import com.foongdoll.portfolio.planovabe.dto.response.AuthResponse;
import com.foongdoll.portfolio.planovabe.dto.response.UserResponse;
import com.foongdoll.portfolio.planovabe.security.UserPrincipal;
import com.foongdoll.portfolio.planovabe.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(authService.getCurrentUser(principal.id()));
    }
}

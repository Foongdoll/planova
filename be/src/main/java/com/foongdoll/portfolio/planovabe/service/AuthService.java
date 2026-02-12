package com.foongdoll.portfolio.planovabe.service;

import com.foongdoll.portfolio.planovabe.dto.request.LoginRequest;
import com.foongdoll.portfolio.planovabe.dto.request.SignupRequest;
import com.foongdoll.portfolio.planovabe.dto.response.AuthResponse;
import com.foongdoll.portfolio.planovabe.dto.response.UserResponse;
import com.foongdoll.portfolio.planovabe.entity.User;
import com.foongdoll.portfolio.planovabe.exception.DuplicateResourceException;
import com.foongdoll.portfolio.planovabe.exception.InvalidRequestException;
import com.foongdoll.portfolio.planovabe.exception.ResourceNotFoundException;
import com.foongdoll.portfolio.planovabe.repository.UserRepository;
import com.foongdoll.portfolio.planovabe.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already in use: " + request.email());
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();
        user = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidRequestException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }

    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.from(user);
    }
}

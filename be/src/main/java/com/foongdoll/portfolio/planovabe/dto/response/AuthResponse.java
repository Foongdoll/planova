package com.foongdoll.portfolio.planovabe.dto.response;

public record AuthResponse(
    String token,
    UserResponse user
) {}

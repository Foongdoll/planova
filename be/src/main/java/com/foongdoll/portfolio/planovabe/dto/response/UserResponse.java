package com.foongdoll.portfolio.planovabe.dto.response;

import com.foongdoll.portfolio.planovabe.entity.User;
import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String email,
    LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getCreatedAt());
    }
}

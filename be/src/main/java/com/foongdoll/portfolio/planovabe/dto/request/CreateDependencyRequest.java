package com.foongdoll.portfolio.planovabe.dto.request;

import jakarta.validation.constraints.NotNull;

public record CreateDependencyRequest(
    @NotNull Long fromTaskId,
    @NotNull Long toTaskId
) {}

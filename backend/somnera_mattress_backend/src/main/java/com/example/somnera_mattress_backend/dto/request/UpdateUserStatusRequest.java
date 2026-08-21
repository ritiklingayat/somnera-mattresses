package com.example.somnera_mattress_backend.dto.request;

import com.example.somnera_mattress_backend.entity.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserStatusRequest {

    @NotNull(message = "Status is required")
    private Status status;
}
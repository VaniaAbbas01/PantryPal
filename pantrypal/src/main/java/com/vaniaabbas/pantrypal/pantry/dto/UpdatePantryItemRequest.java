package com.vaniaabbas.pantrypal.pantry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdatePantryItemRequest(
        @NotBlank @Size(max = 255) String name,
        @Positive BigDecimal quantity,
        @Size(max = 50) String unit,
        @Size(max = 100) String category,
        LocalDate expiresAt) {
}

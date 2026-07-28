package com.vaniaabbas.pantrypal.pantry.dto;

import com.vaniaabbas.pantrypal.pantry.PantryItem;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record PantryItemResponse(
        Long id,
        String name,
        BigDecimal quantity,
        String unit,
        String category,
        LocalDate expiresAt,
        Instant createdAt,
        Instant updatedAt) {

    public static PantryItemResponse from(PantryItem item) {
        return new PantryItemResponse(
                item.getId(),
                item.getName(),
                item.getQuantity(),
                item.getUnit(),
                item.getCategory(),
                item.getExpiresAt(),
                item.getCreatedAt(),
                item.getUpdatedAt());
    }
}

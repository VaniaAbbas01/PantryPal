package com.vaniaabbas.pantrypal.recipe.dto;

import java.math.BigDecimal;

public record RecipeIngredientDto(
        Long id,
        String name,
        BigDecimal quantity,
        String unit,
        boolean isOptional,
        boolean isAvailable
) {}

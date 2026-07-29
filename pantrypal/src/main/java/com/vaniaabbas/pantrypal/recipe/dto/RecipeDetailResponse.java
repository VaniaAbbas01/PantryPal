package com.vaniaabbas.pantrypal.recipe.dto;

import java.util.List;

public record RecipeDetailResponse(
        Long id,
        String title,
        String description,
        String instructions,
        int prepTimeMinutes,
        int cookTimeMinutes,
        int servings,
        String difficulty,
        List<RecipeIngredientDto> ingredients,
        int matchPercentage,
        boolean canMake
) {}

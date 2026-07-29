package com.vaniaabbas.pantrypal.recipe.dto;

import java.util.List;

public record RecipeMatchResponse(
        Long id,
        String title,
        String description,
        int prepTimeMinutes,
        int cookTimeMinutes,
        int servings,
        String difficulty,
        List<String> matchedIngredients,
        List<String> missingIngredients,
        int matchPercentage,
        boolean canMake
) {}

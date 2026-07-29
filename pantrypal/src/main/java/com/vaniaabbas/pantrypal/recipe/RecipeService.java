package com.vaniaabbas.pantrypal.recipe;

import com.vaniaabbas.pantrypal.pantry.PantryItem;
import com.vaniaabbas.pantrypal.pantry.PantryItemRepository;
import com.vaniaabbas.pantrypal.recipe.dto.RecipeDetailResponse;
import com.vaniaabbas.pantrypal.recipe.dto.RecipeIngredientDto;
import com.vaniaabbas.pantrypal.recipe.dto.RecipeMatchResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final PantryItemRepository pantryItemRepository;

    public RecipeService(RecipeRepository recipeRepository, PantryItemRepository pantryItemRepository) {
        this.recipeRepository = recipeRepository;
        this.pantryItemRepository = pantryItemRepository;
    }

    public List<RecipeMatchResponse> findMatchingRecipes(Long userId) {
        List<PantryItem> pantryItems = pantryItemRepository.findByUserIdOrderByNameAsc(userId);
        Set<String> pantryNames = pantryItems.stream()
                .map(PantryItem::getName)
                .collect(Collectors.toSet());

        List<Recipe> recipes = recipeRepository.findAllWithIngredients();

        return recipes.stream()
                .map(recipe -> calculateMatch(recipe, pantryNames))
                .sorted(Comparator.comparingInt(RecipeMatchResponse::matchPercentage).reversed()
                        .thenComparingInt(r -> r.missingIngredients().size())
                        .thenComparing(RecipeMatchResponse::title))
                .collect(Collectors.toList());
    }

    public RecipeDetailResponse getRecipeDetail(Long recipeId, Long userId) {
        Recipe recipe = recipeRepository.findByIdWithIngredients(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException(recipeId));

        List<PantryItem> pantryItems = pantryItemRepository.findByUserIdOrderByNameAsc(userId);
        Set<String> pantryNames = pantryItems.stream()
                .map(PantryItem::getName)
                .collect(Collectors.toSet());

        List<RecipeIngredientDto> ingredientDtos = new ArrayList<>();
        int requiredCount = 0;
        int matchedRequiredCount = 0;

        for (RecipeIngredient ing : recipe.getIngredients()) {
            boolean available = isIngredientInPantry(ing.getName(), pantryNames);
            ingredientDtos.add(new RecipeIngredientDto(
                    ing.getId(),
                    ing.getName(),
                    ing.getQuantity(),
                    ing.getUnit(),
                    ing.isOptional(),
                    available
            ));

            if (!ing.isOptional()) {
                requiredCount++;
                if (available) {
                    matchedRequiredCount++;
                }
            }
        }

        int matchPercentage = requiredCount == 0 ? 100 : (matchedRequiredCount * 100) / requiredCount;
        boolean canMake = matchedRequiredCount == requiredCount;

        return new RecipeDetailResponse(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getDescription(),
                recipe.getInstructions(),
                recipe.getPrepTimeMinutes(),
                recipe.getCookTimeMinutes(),
                recipe.getServings(),
                recipe.getDifficulty(),
                ingredientDtos,
                matchPercentage,
                canMake
        );
    }

    private RecipeMatchResponse calculateMatch(Recipe recipe, Set<String> pantryNames) {
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        int requiredCount = 0;
        int matchedRequiredCount = 0;

        for (RecipeIngredient ing : recipe.getIngredients()) {
            boolean available = isIngredientInPantry(ing.getName(), pantryNames);
            if (available) {
                matched.add(ing.getName());
                if (!ing.isOptional()) {
                    requiredCount++;
                    matchedRequiredCount++;
                }
            } else {
                if (!ing.isOptional()) {
                    missing.add(ing.getName());
                    requiredCount++;
                }
            }
        }

        int matchPercentage = requiredCount == 0 ? 100 : (matchedRequiredCount * 100) / requiredCount;
        boolean canMake = matchedRequiredCount == requiredCount;

        return new RecipeMatchResponse(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getDescription(),
                recipe.getPrepTimeMinutes(),
                recipe.getCookTimeMinutes(),
                recipe.getServings(),
                recipe.getDifficulty(),
                matched,
                missing,
                matchPercentage,
                canMake
        );
    }

    private boolean isIngredientInPantry(String recipeIngName, Set<String> pantryNames) {
        String normalizedRecipeIng = normalize(recipeIngName);
        for (String pantryName : pantryNames) {
            String normalizedPantry = normalize(pantryName);
            if (normalizedRecipeIng.equals(normalizedPantry) ||
                normalizedRecipeIng.contains(normalizedPantry) ||
                normalizedPantry.contains(normalizedRecipeIng)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String name) {
        if (name == null) return "";
        String s = name.trim().toLowerCase();
        if (s.endsWith("es") && s.length() > 4) {
            s = s.substring(0, s.length() - 2);
        } else if (s.endsWith("s") && s.length() > 3) {
            s = s.substring(0, s.length() - 1);
        }
        return s;
    }
}

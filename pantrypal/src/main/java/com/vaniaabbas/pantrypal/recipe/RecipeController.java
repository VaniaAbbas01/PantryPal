package com.vaniaabbas.pantrypal.recipe;

import com.vaniaabbas.pantrypal.config.CurrentUserService;
import com.vaniaabbas.pantrypal.recipe.dto.RecipeDetailResponse;
import com.vaniaabbas.pantrypal.recipe.dto.RecipeMatchResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;
    private final CurrentUserService currentUserService;

    public RecipeController(RecipeService recipeService, CurrentUserService currentUserService) {
        this.recipeService = recipeService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/match")
    public List<RecipeMatchResponse> findMatchingRecipes() {
        long userId = currentUserService.requireUserId();
        return recipeService.findMatchingRecipes(userId);
    }

    @GetMapping("/{id}")
    public RecipeDetailResponse getRecipeDetail(@PathVariable Long id) {
        long userId = currentUserService.requireUserId();
        return recipeService.getRecipeDetail(id, userId);
    }
}

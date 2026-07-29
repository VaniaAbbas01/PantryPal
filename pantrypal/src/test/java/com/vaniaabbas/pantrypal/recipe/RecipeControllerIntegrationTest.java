package com.vaniaabbas.pantrypal.recipe;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import com.vaniaabbas.pantrypal.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
class RecipeControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void findMatchingRecipesReturnsMatchesSortedByMatchPercentage() throws Exception {
        String token = registerAndGetToken("recipe-user1@example.com");

        // Add pantry items: Eggs, Butter
        mockMvc.perform(post("/api/pantry")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"Eggs","quantity":4,"unit":"count"}"""))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/pantry")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"Butter","quantity":100,"unit":"g"}"""))
                .andExpect(status().isCreated());

        // Call match recipes endpoint
        mockMvc.perform(get("/api/recipes/match")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Classic Scrambled Eggs"))
                .andExpect(jsonPath("$[0].canMake").value(true))
                .andExpect(jsonPath("$[0].matchPercentage").value(100));
    }

    @Test
    void getRecipeDetailReturnsFullRecipeWithPantryAvailability() throws Exception {
        String token = registerAndGetToken("recipe-user2@example.com");

        // Add Bread & Cheese
        mockMvc.perform(post("/api/pantry")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"Bread","quantity":6,"unit":"slices"}"""))
                .andExpect(status().isCreated());

        // Get details for Cheese Toastie (id = 2 from V3 migration)
        mockMvc.perform(get("/api/recipes/2")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Crispy Cheese Toastie"))
                .andExpect(jsonPath("$.ingredients[0].name").value("Bread"))
                .andExpect(jsonPath("$.ingredients[0].isAvailable").value(true));
    }

    @Test
    void getNonExistentRecipeReturnsNotFound() throws Exception {
        String token = registerAndGetToken("recipe-user3@example.com");

        mockMvc.perform(get("/api/recipes/999999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    private String registerAndGetToken(String email) throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"email":"%s","password":"password123"}""".formatted(email)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(response, "$.accessToken");
    }
}

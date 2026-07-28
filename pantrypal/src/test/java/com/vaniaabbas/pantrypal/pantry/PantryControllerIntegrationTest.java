package com.vaniaabbas.pantrypal.pantry;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
class PantryControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    void crudLifecycle() throws Exception {
        String token = registerAndGetToken("pantry-alice@example.com");

        String createResponse = mockMvc.perform(post("/api/pantry")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Eggs","quantity":12,"unit":"count","category":"Dairy"}"""))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Eggs"))
                .andExpect(jsonPath("$.quantity").value(12))
                .andReturn().getResponse().getContentAsString();

        long itemId = ((Number) JsonPath.read(createResponse, "$.id")).longValue();

        mockMvc.perform(get("/api/pantry").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Eggs"));

        mockMvc.perform(get("/api/pantry/" + itemId).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unit").value("count"));

        mockMvc.perform(put("/api/pantry/" + itemId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Free-range eggs","quantity":10,"unit":"count","category":"Dairy"}"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Free-range eggs"))
                .andExpect(jsonPath("$.quantity").value(10));

        mockMvc.perform(delete("/api/pantry/" + itemId).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/pantry/" + itemId).header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void usersOnlySeeTheirOwnItems() throws Exception {
        String aliceToken = registerAndGetToken("pantry-bob-owner@example.com");
        String bobToken = registerAndGetToken("pantry-carol-owner@example.com");

        String createResponse = mockMvc.perform(post("/api/pantry")
                        .header("Authorization", "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Milk"}"""))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long itemId = ((Number) JsonPath.read(createResponse, "$.id")).longValue();

        mockMvc.perform(get("/api/pantry").header("Authorization", "Bearer " + bobToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        mockMvc.perform(get("/api/pantry/" + itemId).header("Authorization", "Bearer " + bobToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/pantry/" + itemId)
                        .header("Authorization", "Bearer " + bobToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Stolen milk"}"""))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/pantry/" + itemId).header("Authorization", "Bearer " + bobToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void invalidCreateReturnsValidationErrors() throws Exception {
        String token = registerAndGetToken("pantry-dave@example.com");

        mockMvc.perform(post("/api/pantry")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","quantity":-1}"""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").isNotEmpty())
                .andExpect(jsonPath("$.errors.quantity").isNotEmpty());
    }

    @Test
    void unauthenticatedRequestsAreRejected() throws Exception {
        mockMvc.perform(get("/api/pantry"))
                .andExpect(status().isUnauthorized());
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

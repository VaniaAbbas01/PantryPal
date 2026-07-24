package com.vaniaabbas.pantrypal.auth.dto;

import java.time.Instant;

public record TokenResponse(String accessToken, String tokenType, Instant expiresAt) {

    public static TokenResponse bearer(String accessToken, Instant expiresAt) {
        return new TokenResponse(accessToken, "Bearer", expiresAt);
    }
}

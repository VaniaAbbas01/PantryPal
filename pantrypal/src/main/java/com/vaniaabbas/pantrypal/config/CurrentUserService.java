package com.vaniaabbas.pantrypal.config;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    public long requireUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return Long.parseLong(jwtAuth.getToken().getSubject());
        }
        throw new IllegalStateException("No authenticated user");
    }
}

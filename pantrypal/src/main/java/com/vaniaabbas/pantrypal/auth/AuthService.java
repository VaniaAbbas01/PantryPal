package com.vaniaabbas.pantrypal.auth;

import com.vaniaabbas.pantrypal.auth.dto.LoginRequest;
import com.vaniaabbas.pantrypal.auth.dto.RegisterRequest;
import com.vaniaabbas.pantrypal.auth.dto.TokenResponse;
import com.vaniaabbas.pantrypal.user.User;
import com.vaniaabbas.pantrypal.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new EmailAlreadyUsedException(request.email());
        }
        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.displayName());
        userRepository.save(user);
        return toToken(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .filter(u -> passwordEncoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(InvalidCredentialsException::new);
        return toToken(user);
    }

    private TokenResponse toToken(User user) {
        TokenService.IssuedToken token = tokenService.issue(user);
        return TokenResponse.bearer(token.value(), token.expiresAt());
    }
}

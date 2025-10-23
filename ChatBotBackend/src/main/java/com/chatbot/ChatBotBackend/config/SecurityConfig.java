package com.chatbot.ChatBotBackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // Disable CSRF for dev/testing
                .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll() // Allow signup & login
                .requestMatchers("/api/chat/**").permitAll() // Allow chat endpoints
                .anyRequest().authenticated()
                .and()
                .formLogin().disable()
                .httpBasic().disable();

        return http.build();
    }
}
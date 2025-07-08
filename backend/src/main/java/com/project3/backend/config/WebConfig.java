package com.project3.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://192.168.0.134:3000",  // (내부 IP에서 접근하는 경우)
                        "http://192.168.0.134:3001"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
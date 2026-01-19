package com.Agora.Agora.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/Agora")
public class HealthController {
    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}

package com.project3.backend;

import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
public class HelloWorldController {

    @GetMapping("/api/hello")
    public List<String> hello() {
        return Arrays.asList("안녕하세요", "Hello");
    }
}

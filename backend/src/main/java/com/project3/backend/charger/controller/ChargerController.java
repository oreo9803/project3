package com.project3.backend.charger.controller;

import com.project3.backend.charger.service.ChargerService;
import com.project3.backend.charger.vo.ChargerVO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chargers")
@CrossOrigin(origins = "*") // ✅ CORS 허용 (필요 시)
public class ChargerController {

    private final ChargerService chargerService;

    public ChargerController(ChargerService chargerService) {
        this.chargerService = chargerService;
    }

    @GetMapping
    public List<ChargerVO> getChargersByZcode(@RequestParam String zcode) {
        return chargerService.getChargersByZcode(zcode);
    }
}

package com.project3.backend.charger.controller;

import com.project3.backend.charger.service.ChargerService;
import com.project3.backend.charger.vo.ChargerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chargers")
public class ChargerController {

    @Autowired
    private ChargerService chargerService;

    @GetMapping
    public List<ChargerVO> getChargers(@RequestParam String zcode) {
        return chargerService.getChargersByZcode(zcode);
    }
}
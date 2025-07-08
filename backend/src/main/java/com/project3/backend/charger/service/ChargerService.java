package com.project3.backend.charger.service;

import com.project3.backend.charger.dao.ChargerDAO;
import com.project3.backend.charger.vo.ChargerVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChargerService {
    @Autowired
    private ChargerDAO chargerDAO;

    public List<ChargerVO> getAllCharger() {
        return chargerDAO.selectAllCharger();
    }
}
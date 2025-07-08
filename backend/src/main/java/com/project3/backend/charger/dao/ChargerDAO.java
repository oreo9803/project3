package com.project3.backend.charger.dao;

import com.project3.backend.charger.vo.ChargerVO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface ChargerDAO {
    List<ChargerVO> selectAllCharger();
}
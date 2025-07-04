package com.project3.backend.charger.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChargerVO {
    private String statId;       // 충전소 ID
    private String chgerId;      // 충전기 ID
    private String statNm;       // 충전소명
    private String addr;         // 주소
    private String stat;         // 상태
    private String statUpdDt;    // 상태 변경 일시
    private Double lat;
    private Double lng;
}

package com.project3.backend.charger.vo;

import lombok.Data;

@Data
public class ChargerVO {
    private String statId;
    private String chgerId;
    private String statNm;
    private String addr;
    private String stat;
    private String statUpdDt;
    private Double lat;
    private Double lng;
}
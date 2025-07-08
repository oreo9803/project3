package com.project3.backend.charger.vo;

import lombok.Data;


@Data
public class ChargerVO {
    private Long parkingId;
    private String parkingName;
    private Double parkingLon;
    private Double parkingLat;
    private String parkingFee;
    private String parkingCode;
    private String parkingAddress;
    private String parkingAddressD;
}


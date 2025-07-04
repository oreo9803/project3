package com.project3.backend.charger.service;

import com.project3.backend.charger.vo.ChargerVO;

import org.springframework.stereotype.Service;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@Service

public class ChargerService {
    private final String API_KEY = "YgV1BhJxbWJKaUUVPFk5Ix4ReH2UAlK0kBcxyX%2BqVLJUG0%2FXUnMoxWYg3zAMt6N4rJGdJAHMxjoxd10%2BWwhuow%3D%3D";

    public List<ChargerVO> getChargersByZcode(String zcode) {
        List<ChargerVO> list = new ArrayList<>();
        try {
            String url = String.format(
                    "https://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=%s&zcode=%s&pageNo=1&numOfRows=1000",
                    URLEncoder.encode(API_KEY, "UTF-8"), zcode
            );

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(url);
            NodeList items = doc.getElementsByTagName("item");

            for (int i = 0; i < items.getLength(); i++) {
                Element e = (Element) items.item(i);

                ChargerVO charger = new ChargerVO();
                charger.setStatId(getTagValue("statId", e));
                charger.setChgerId(getTagValue("chgerId", e));
                charger.setStatNm(getTagValue("statNm", e));
                charger.setAddr(getTagValue("addr", e));
                charger.setStat(getTagValue("stat", e));
                charger.setStatUpdDt(getTagValue("statUpdDt", e));
                charger.setLat(Double.parseDouble(getTagValue("lat", e)));
                charger.setLng(Double.parseDouble(getTagValue("lng", e)));

                list.add(charger);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    private String getTagValue(String tag, Element e) {
        try {
            return e.getElementsByTagName(tag).item(0).getTextContent();
        } catch (Exception ex) {
            return "";
        }
    }
}

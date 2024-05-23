package nnu.edu.station.service;

import com.alibaba.fastjson2.JSONObject;

import java.util.List;
import java.util.Map;

public interface StationService {
    Object getInfoByName(String name);

    List<Object> getAllStations();

    List<String> getTodayStation();

    List<String> getTodayStationForecast();

    List<String> getTodayStationPrecise();

    List<String> getTodayStationReal();

    Map<String,Object> getStationByNameAndTime(String station);

    Map<String,Object> getStationByNameTimeAndField(String station, String fieldName);
}

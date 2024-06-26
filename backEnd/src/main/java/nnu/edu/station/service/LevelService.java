package nnu.edu.station.service;

import com.alibaba.fastjson2.JSONArray;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface LevelService {

    // V1 Service

    Integer ifTyph(String time);

    List<Map<String, Object>> getAllInfoByStation(String station);

    JSONArray get72RealInfoByStation(String station) throws IOException;

    List<Map<String, Object>> getNoTyphAllByStation(String station);

    List<Map<String, Object>> getTyphAllByStation(String station);

    Map<String, Object> getBefore72ByStation(String station);

    Map<String, Object> get72ByStation(String station);

    Map<String, Object> getNoTyph72ByStation(String station);

    Map<String, Object> getTyph72ByStation(String station);

    List<Map<String, Object>> getNoTyph72ManualByStation(String station);

    List<Map<String, Object>> getTyph72ManualByStation(String station);

    List<Map<String, Object>> getNoTyphAllManualByStation(String station);

    // V2 Service

    Map<String, Object> get48scNotyNoman(String station);

    Map<String, Object> get48ybNotyNoman(String station);

    List<Map<String, Object>> getAllManul();

    Map<String, Object> getManuelByTime(String time);

}

package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface LevelService {
    List<Map<String, Object>> getAllInfoByStation(String station);

    List<Map<String, Object>> getNoTyph72ByStation(String station);

    List<Map<String, Object>> getTyph72ByStation(String station);

    List<Map<String, Object>> getNoTyphAllByStation(String station);

    List<Map<String, Object>> getNoTyph72ManualByStation(String station);

    List<Map<String, Object>> getTyph72ManualByStation(String station);

    List<Map<String, Object>> getNoTyphAllManualByStation(String station);
}

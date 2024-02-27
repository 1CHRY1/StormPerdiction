package nnu.edu.station.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface LevelService {
    List<Map<String, Object>> getAllInfoByStation(String station);

    String getAllRealInfoByStation(String station) throws IOException;

    List<Map<String, Object>> getNoTyphAllByStation(String station);

    List<Map<String, Object>> getTyphAllByStation(String station);

    Map<String, Object> getBefore72ByStation(String station);

    Map<String, Object> get72ByStation(String station);

    Map<String, Object> getNoTyph72ByStation(String station);

    Map<String, Object> getTyph72ByStation(String station);

    List<Map<String, Object>> getNoTyph72ManualByStation(String station);

    List<Map<String, Object>> getTyph72ManualByStation(String station);

    List<Map<String, Object>> getNoTyphAllManualByStation(String station);

}

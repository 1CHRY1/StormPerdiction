package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface LevelService {
    List<Map<String, Object>> getAllInfoByStation(String station);

    List<Float> getNoTyph72ByStation(String station);

    List<Float> getTyph72ByStation(String station);

    List<Float> getNoTyphAllByStation(String station);

    List<Float> getNoTyph72ManualByStation(String station);

    List<Float> getTyph72ManualByStation(String station);

    List<Float> getNoTyphAllManualByStation(String station);
}

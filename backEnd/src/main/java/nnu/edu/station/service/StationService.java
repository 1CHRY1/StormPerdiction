package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface StationService {
    Map<String, Object> getInfoByName(String name);

    List<String> getAllStations();
}

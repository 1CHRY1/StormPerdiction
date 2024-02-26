package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface StationService {
    Object getInfoByName(String name);

    List<Object> getAllStations();
}

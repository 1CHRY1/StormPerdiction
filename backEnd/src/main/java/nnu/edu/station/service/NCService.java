package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface NCService {
    Map<String, String> getInfoByTimeAndType(String time, Integer type);
}

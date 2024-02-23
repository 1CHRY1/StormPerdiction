package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface NCService {

    List<String> getAll();

    Map<String, String> getInfoByTimeAndType(String time, String type);
}

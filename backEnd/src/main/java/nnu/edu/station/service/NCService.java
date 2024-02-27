package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface NCService {

    List<Object> getAll();

    List<List<String>> getTxtDataByTime(String time);

    Object getInfoByTimeAndType(String time, String type);
}

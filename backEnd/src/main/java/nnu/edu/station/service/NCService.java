package nnu.edu.station.service;

import java.util.List;
import java.util.Map;

public interface NCService {

    List<Object> getAll();

    Object getInfoByTimeAndType(String time, String type);
}

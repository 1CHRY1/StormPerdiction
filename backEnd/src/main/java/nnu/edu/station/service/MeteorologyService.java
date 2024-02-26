package nnu.edu.station.service;

import java.util.List;

public interface MeteorologyService {
    List<Object> getAll();

    List<Object> getCloud();

    List<Object> getRadar();

    List<Object> getRainfall();

    List<Object> getRainfallpre();

    Object getInfoByTimeAndType(String time, String type1, String type2, String type3);
}

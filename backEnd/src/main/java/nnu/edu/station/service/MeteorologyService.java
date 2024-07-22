package nnu.edu.station.service;

import com.alibaba.fastjson2.JSONArray;

import java.util.List;

public interface MeteorologyService {
    List<Object> getAll();

    List<Object> getCloud();

    List<Object> getRadar();

    List<Object> getRainfall();

    List<Object> getRainfallpre();

    Object getTyphoon();

    Object getInfoByTimeAndType(String time, String type1, String type2, String type3);

    Object getTyphoonByYear(String year);

    Object getTyphoonByTid(String tid);
}

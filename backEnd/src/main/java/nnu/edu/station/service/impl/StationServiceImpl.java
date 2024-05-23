package nnu.edu.station.service.impl;

import com.alibaba.fastjson2.JSONObject;
import nnu.edu.station.common.utils.FileUtil;
import nnu.edu.station.common.utils.ListUtil;
import nnu.edu.station.dao.level.StationMapper;
import nnu.edu.station.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class StationServiceImpl implements StationService {

    @Autowired
    StationMapper stationMapper;

    @Value("${stations}")
    String station_path;

    private String getLocalTimeStr() {
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return time.format(formatter);
    }

    private String getLocalTimeBeforeStr(Integer i) {
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).minusDays(i);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return time.format(formatter);
    }

    @Override
    public Object getInfoByName(String name) {
        return stationMapper.getInfoByName(name);
    }

    @Override
    public List<Object> getAllStations(){
        return stationMapper.getAllStations();
    }

    @Override
    public List<String> getTodayStation() {
        // 当天有数据的站点选择
        List<String> TodayStations = new ArrayList<>();
        // 获取所有站点数据
        Path fullPath = Paths.get(station_path);
        JSONObject stations = FileUtil.readJsonObjectFile(fullPath.toString());
        Set<String> keys = stations.keySet();
        for (String key : keys) {
            String TodayStation = key.toString();
            if (getStationByNameAndTime(TodayStation) != null) {
                TodayStations.add(TodayStation);
            }
        }
        return TodayStations;
    }

    @Override
    public List<String> getTodayStationForecast() {
        // 当天有数据的站点选择
        List<String> TodayStations = new ArrayList<>();
        // 获取所有站点数据
        Path fullPath = Paths.get(station_path);
        JSONObject stations = FileUtil.readJsonObjectFile(fullPath.toString());
        Set<String> keys = stations.keySet();
        for (String key : keys) {
            String TodayStation = key.toString();
            if (getStationByNameTimeAndField(TodayStation, "hpre") != null) {
                TodayStations.add(TodayStation);
            }
        }
        return TodayStations;
    }

    @Override
    public List<String> getTodayStationPrecise() {
        // 当天有数据的站点选择
        List<String> TodayStations = new ArrayList<>();
        // 获取所有站点数据
        Path fullPath = Paths.get(station_path);
        JSONObject stations = FileUtil.readJsonObjectFile(fullPath.toString());
        Set<String> keys = stations.keySet();
        for (String key : keys) {
            String TodayStation = key.toString();
            if (getStationByNameTimeAndField(TodayStation, "hshice") != null) {
                TodayStations.add(TodayStation);
            }
        }
        return TodayStations;
    }

    @Override
    public List<String> getTodayStationReal() {
        // 当天有数据的站点选择
        List<String> TodayStations = new ArrayList<>();
        // 获取所有站点数据
        Path fullPath = Paths.get(station_path);
        JSONObject stations = FileUtil.readJsonObjectFile(fullPath.toString());
        Set<String> keys = stations.keySet();
        for (String key : keys) {
            String TodayStation = key.toString();
            if (stations.getJSONObject(TodayStation).get("ifReal") != "no") {
                TodayStations.add(TodayStation);
            }
        }
        return TodayStations;
    }

    @Override
    public Map<String,Object> getStationByNameAndTime(String station) {
        // 获取某站点当天时间的数据
        String localTime = getLocalTimeStr();
        Map<String, Object> obj = ListUtil.StringObj2ArrayObj(stationMapper.getStationByNameAndTime(station, localTime));
        if (obj == null) {
            localTime = getLocalTimeBeforeStr(1);
            obj = ListUtil.StringObj2ArrayObj(stationMapper.getStationByNameAndTime(station, localTime));
        }
        return obj;
    }

    @Override
    public Map<String,Object> getStationByNameTimeAndField(String station, String fieldName) {
        // 获取某站点当天时间的数据
        String localTime = getLocalTimeStr();
        Map<String, Object> obj = ListUtil.StringObj2ArrayObj(stationMapper.getStationByNameTimeAndField(station, localTime, fieldName));
        if (obj == null) {
            localTime = getLocalTimeBeforeStr(1);
            obj = ListUtil.StringObj2ArrayObj(stationMapper.getStationByNameTimeAndField(station, localTime, fieldName));
        }
        return obj;
    }

}

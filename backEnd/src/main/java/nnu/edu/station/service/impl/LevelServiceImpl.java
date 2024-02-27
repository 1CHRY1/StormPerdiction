package nnu.edu.station.service.impl;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.sun.org.apache.xpath.internal.operations.Bool;
import net.sf.jsqlparser.expression.DateTimeLiteralExpression;
import nnu.edu.station.common.utils.FileUtil;
import nnu.edu.station.common.utils.HttpUtil;
import nnu.edu.station.common.utils.ListUtil;
import nnu.edu.station.dao.level.LevelMapper;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class LevelServiceImpl implements LevelService {

    @Autowired
    LevelMapper levelMapper;

    @Value("${stations}")
    String station_path;

    @Override
    public String getAllRealInfoByStation(String station) throws IOException {
        // 获取站点实测数据信息
        Path currentPath = Paths.get(System.getProperty("user.dir"));
        Path parentPath = currentPath.getParent();
        Path fullPath = parentPath.resolve(station_path);
        JSONObject stations = FileUtil.readJsonObjectFile(fullPath.toString());
        // 处理json
        Set<String> keys = stations.keySet();
        String url_time = "";
        String name = "";
        for (String key : keys) {
            if (key.equals(station)) {
                url_time = stations.getJSONObject(key).getString("api_time");
                name = stations.getJSONObject(key).getString("name");
            }
        }
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime threeDaysAgo = currentTime.minusDays(3);
        String url = url_time + "/" + name + "/" + threeDaysAgo + "/" + currentTime;
        // 获取实时监测数据
        String response = HttpUtil.getResponseByUrl(url);
        return response;
    }

    @Override
    public List<Map<String, Object>> getAllInfoByStation(String station) {
        List<Map<String, Object>> objs = levelMapper.getAllInfoByStation(station);
        return ListUtil.StringObjList2ArrayObjList(objs);
    }

    @Override
    public List<Map<String, Object>> getNoTyphAllByStation(String station) {
        List<Map<String, Object>> objs = levelMapper.getNoTyphAllByStation(station);
        return ListUtil.StringObjList2ArrayObjList(objs);
    }

    @Override
    public List<Map<String, Object>> getTyphAllByStation(String station) {
        List<Map<String, Object>> objs = levelMapper.getTyphAllByStation(station);
        return  ListUtil.StringObjList2ArrayObjList(objs);
    }

    @Override
    public Map<String, Object> getBefore72ByStation(String station) {
        station = station + "_hz";
        LocalDateTime currenttime = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(30).withHour(0).withMinute(0).withSecond(0).withNano(0).minusSeconds(1);
        LocalDateTime beforetime = currenttime.minusDays(3);
//        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).minusSeconds(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String currenttime_str = currenttime.format(formatter);
        String beforetime_str = beforetime.format(formatter);
        List<Map<String,Double>> hz_values = levelMapper.getBefore72ByStation(station, beforetime_str, currenttime_str);
        Double[] hz = new Double[hz_values.size()];
        Integer i = 0;
        for (Map<String,Double> hz_value : hz_values){
            hz[i++] = hz_value.get("hz_value");
        }
        Map<String, Object> obj = new HashMap<>();
        obj.put("time", currenttime_str);
        obj.put("hz",hz);
        return obj;
    }

    @Override
    public Map<String, Object> get72ByStation(String station) {
        LocalDateTime time = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(30).withHour(0).withMinute(0).withSecond(0).withNano(0);
//        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        Integer ifTyph = levelMapper.ifTyph(station,time_str);
        try{
            if ( ifTyph == 1){
                return getTyph72ByStation(station);
            } else {
                return getNoTyph72ByStation(station);
            }
        } catch ( Exception e){
            Map<String, Object> obj = new HashMap<>();
            return obj;
        }
    }

    @Override
    public Map<String, Object> getNoTyph72ByStation(String station) {
        LocalDateTime time = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(30).withHour(0).withMinute(0).withSecond(0).withNano(0);
//        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        try{
            Map<String, Object> obj = levelMapper.getNoTyph72ByStation(station, time_str);
            obj.put("time",time_str);
            return ListUtil.StringObj2ArrayObj(obj);
        }
        catch ( Exception e ) {
            Map<String, Object> obj = new HashMap<>();
            return obj;
        }
    }

    @Override
    public Map<String, Object> getTyph72ByStation(String station) {
        LocalDateTime time = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(31).withHour(0).withMinute(0).withSecond(0).withNano(0);
//        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        try {
            Map<String, Object> obj = ListUtil.StringObj2ArrayObj(levelMapper.getTyph72ByStation(station, time_str));
            List<Double> hadd = (List<Double>) obj.get("hadd");
            List<Double> hpre = (List<Double>) obj.get("hpre");
            List<Double> hyubao = (List<Double>) obj.get("hyubao");
            obj.replace("hadd", hadd.subList(72,144));
            obj.replace("hpre", hpre.subList(72,144));
            obj.replace("hyubao", hyubao.subList(72,144));
            obj.put("time",time_str);
            return obj;
        } catch (Exception e) {
            Map<String, Object> obj = new HashMap<>();
            return obj;
        }
    }

    @Override
    public List<Map<String, Object>> getNoTyph72ManualByStation(String station) {
        return  levelMapper.getNoTyph72ManualByStation(station);
    }

    @Override
    public List<Map<String, Object>> getTyph72ManualByStation(String station) {
        return  levelMapper.getTyph72ManualByStation(station);
    }

    @Override
    public List<Map<String, Object>> getNoTyphAllManualByStation(String station) {
        return  levelMapper.getNoTyphAllManualByStation(station);
    }
}

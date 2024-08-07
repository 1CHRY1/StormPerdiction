package nnu.edu.station.service.impl;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
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
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class LevelServiceImpl implements LevelService {

    // V1 Service

    @Autowired
    LevelMapper levelMapper;

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
    public Integer ifTyph(String time) {
        return levelMapper.ifTyph(time);
    }

    @Override
    public JSONArray get72RealInfoByStation(String station) throws IOException {
        // 获取站点实测数据信息
//        Path currentPath = Paths.get(System.getProperty("user.dir"));
//        Path parentPath = currentPath.getParent();
//        Path fullPath = currentPath.resolve(station_path);
        Path fullPath = Paths.get(station_path);
        JSONObject stations = FileUtil.readJsonObjectFile(fullPath.toString());
        // 处理json
        Set<String> keys = stations.keySet();
        String url_time = "";
        String url = "";
        String name = "";
        for (String key : keys) {
            if (key.equals(station)) {
                url_time = stations.getJSONObject(key).getString("api_time");
                name = stations.getJSONObject(key).getString("name");
                break;
            }
        }
        if (url_time == null) {
            return null;
        }
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime threeDaysAgo = currentTime.minusDays(3);
        JSONObject jsonResponse;
        if (name.equals("江阴") || name.equals("徐六泾") || name.equals("连兴港") || name.equals("六滧")){
            url = url_time + "/" + threeDaysAgo.atZone(ZoneOffset.UTC).toInstant().getEpochSecond()*1000 + "/" + currentTime.atZone(ZoneOffset.UTC).toInstant().getEpochSecond()*1000;
            System.out.println(url);
            jsonResponse = HttpUtil.GetRealData4Station(url);
            // 获取实时监测数据
            JSONArray realDataList = (JSONArray) jsonResponse.get("data");
            if (realDataList == null) {
                return null;
            }
            else {
                return ListUtil.realDataProcessingV2(realDataList);
            }
        } else {
            url = url_time + "/" + name + "/" + threeDaysAgo + "/" + currentTime;
            System.out.println(url);
            jsonResponse = HttpUtil.GetRealData(url);
            // 获取实时监测数据
            JSONArray realDataList = (JSONArray) jsonResponse.get("data");
            if (realDataList == null) {
                return null;
            }
            else {
                return ListUtil.realDataProcessing(realDataList);
            }
        }
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
        LocalDateTime currenttime = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).minusSeconds(1);
        LocalDateTime beforetime = currenttime.minusDays(3);
        //        LocalDateTime currenttime = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(30).withHour(0).withMinute(0).withSecond(0).withNano(0).minusSeconds(1);
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
//        LocalDateTime time = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(30).withHour(0).withMinute(0).withSecond(0).withNano(0);
        Integer ifTyph = ifTyph(getLocalTimeStr());
        // 若当天数据未更新，则获取前一天的数据
        if (ifTyph == null) {
            ifTyph = ifTyph(getLocalTimeBeforeStr(1));
        }
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
//        LocalDateTime time = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(30).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        try{
            Map<String, Object> obj = levelMapper.getNoTyph72ByStation(station, time_str);
            if ( obj == null ) {
                time_str = time.minusDays(1).format(formatter);
                obj = levelMapper.getNoTyph72ByStation(station, time_str);
            }
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
//        LocalDateTime time = LocalDateTime.now().withYear(2023).withMonth(8).withDayOfMonth(31).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        try {
            Map<String, Object> obj = ListUtil.StringObj2ArrayObj(levelMapper.getTyph72ByStation(station, time_str));
            if ( obj == null ) {
                time_str = time.minusDays(1).format(formatter);
                obj = levelMapper.getNoTyph72ByStation(station, time_str);
            }
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

    // V2 Service
    @Override
    public Map<String, Object> get48scNotyNoman(String station) {
        String localTime = getLocalTimeStr();
        Map<String, Object> obj = ListUtil.StringObj2ArrayObj(levelMapper.get48scNotyNoman(station, localTime));
        if (obj == null) {
            localTime = getLocalTimeBeforeStr(1);
            obj = ListUtil.StringObj2ArrayObj(levelMapper.get48scNotyNoman(station, localTime));
            obj.put("time",getLocalTimeBeforeStr(3));
            return obj;
        }
        obj.put("time",getLocalTimeBeforeStr(2));
        return obj;
    }

    @Override
    public Map<String, Object> get48ybNotyNoman(String station) {
        String localTime = getLocalTimeStr();
        Map<String, Object> obj = ListUtil.StringObj2ArrayObj(levelMapper.get48ybNotyNoman(station, localTime));
        if (obj == null) {
            localTime = getLocalTimeBeforeStr(1);
            obj = ListUtil.StringObj2ArrayObj(levelMapper.get48ybNotyNoman(station, localTime));
            obj.put("time",getLocalTimeBeforeStr(3));
            return obj;
        }
        obj.put("time",getLocalTimeBeforeStr(2));
        return obj;
    }

    @Override
    public List<Map<String, Object>> getAllManul() {
        String localTime = getLocalTimeStr();
        return levelMapper.getAllManul(localTime);
    }

    @Override
    public Map<String, Object> getManuelByTime(String time) {
        return levelMapper.getManuelByTime(time);
    }
}

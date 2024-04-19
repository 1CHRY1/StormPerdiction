package nnu.edu.station.common.config;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import nnu.edu.station.common.exception.MyException;
import nnu.edu.station.common.result.ResultEnum;
import nnu.edu.station.common.utils.*;
import nnu.edu.station.dao.level.*;
import nnu.edu.station.service.LevelService;
import nnu.edu.station.service.NCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * @Description:定时获取文件夹数据入库
 * @Author: chry
 * @Date: 2024/1/10
 */

@Component
@Slf4j
public class TimeTask {

    @Value("${python}")
    String python;

    @Value("${webdriver}")
    String webdriver;

    @Value("${updateData}")
    String updateData;

    @Value("${dataprocess}")
    String dataprocess;

    @Value("${clawingCloud}")
    String clawingCloud;

    @Value("${clawingRadar}")
    String clawingRadar;

    @Value("${clawingRainfall}")
    String clawingRainfall;

    @Value("${clawingRainfallpre}")
    String clawingRainfallpre;

    @Value("${clawingTyphoon}")
    String clawingTyphoon;

    @Value("${deleteClawingData}")
    String deleteClawingData;

    @Value("${meteorology.file.cloud}")
    String cloudfile;

    @Value("${meteorology.file.radar}")
    String radarfile;

    @Value("${meteorology.file.rainfall}")
    String rainfallfile;

    @Value("${meteorology.file.rainfallpre}")
    String rainfallprefile;

    @Value("${meteorology.db}")
    String meteorologydb;

    @Value("${FieldGenerating}")
    String fieldGenerating;

    @Value("${FieldPath}")
    String field_path;

    @Value("${AddFieldGenerating}")
    String addFieldGenerating;

    @Value("${AddField}")
    String addField;

    @Value("${AddFieldMask}")
    String addFieldMask;

    @Value("${DataProcessLog}")
    String logPath;

    @Autowired
    LevelService levelService;

    @Autowired
    NCService ncService;

//    @Scheduled(cron = "0/5 * * * * *")
    @Scheduled(cron = "0 0 16 * * ?")
    public void executePythonUpdateData() throws IOException {
        // 每日更新站点数据
        UpdateUtil.DataUpdating(python, updateData, dataprocess, logPath);
    }

    @Scheduled(cron = "0 10 */2 * * ?")
    public void executePythonClawingCloudData() throws IOException {
        // 爬取卫星云图数据
        ClawingUtil.ClawingCloudData(python, clawingCloud, meteorologydb, cloudfile, webdriver, logPath);
    }

    @Scheduled(cron = "0 30 */2 * * ?")
    public void executePythonClawingRadarData() throws IOException {
        // 爬取雷达拼图数据
        ClawingUtil.ClawingRadarData(python, clawingRadar, meteorologydb, radarfile, webdriver, logPath);
    }

    @Scheduled(cron = "0 50 */2 * * ?")
    public void executePythonClawingRainfallData() throws IOException {
        // 爬取降水量实况数据
        ClawingUtil.ClawingRainfallData(python, clawingRainfall, meteorologydb, rainfallfile, webdriver, logPath);
    }

    @Scheduled(cron = "0 0 9 * * ?")
    public void executePythonClawingRainfallpreData() throws IOException {
        // 爬取降水量预报数据
        ClawingUtil.ClawingRainfallpreData(python, clawingRainfallpre, meteorologydb, rainfallprefile, webdriver, logPath);
    }

    @Scheduled(cron = "0 20 10 * * ?")
    public void  executePythonClawingTyphoonData() throws IOException {
        // 爬取当日台风数据
        ClawingUtil.ClawingTyphoonData(python, clawingTyphoon, logPath);
    }

    @Scheduled(cron = "00 55 5 * * ?")
    public void executePythonDeleteClawingData() throws IOException {
        // 删除过期数据
        ClawingUtil.DeleteClawingData(python, deleteClawingData, logPath);
    }

//    @Scheduled(cron = "00 40 10 * * ?")
//    @Scheduled(cron = "0/1 * * * * ?")
    public void executePythonFieldProcessingData() throws IOException {
        // 计算当天流场数据
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
//        time = time.withYear(2023).withMonth(8).withDayOfMonth(31);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        Integer iftyph = levelService.ifTyph(time_str);
        String acdirc_path = '"' + ncService.getPathByTimeAndType(time_str, "adcirc") + '"';
        String fort_path = '"' + ncService.getPathByTimeAndType(time_str, "fort63") + '"';
//        Integer iftyph = 1;
//        String acdirc_path = "D:\\1study\\Work\\2023_12_22_Storm\\StormPerdiction\\data\\forecastData\\20240413\\adcirc_addwind.nc";
//        String fort_path = "D:\\1study\\Work\\2023_12_22_Storm\\StormPerdiction\\data\\forecastData\\20240413\\adcirc_addwind.nc";
        // 执行py文件生成流场和风场bin文件
        int FieldGeneratingResult = FieldUtil.executePythonFieldGenerating(python, logPath, fieldGenerating, acdirc_path, field_path);
        if ( FieldGeneratingResult == 0 ) {
            System.out.println("当日流场，风场数据生成成功");
        } else {
            System.out.println(FieldGeneratingResult);
        }
        if ( iftyph == 1 ) {
             // 执行py文件生成憎水场txt
            int addFieldGeneratingResult = FieldUtil.executePythonTxtBuilder4add(python ,logPath ,addFieldGenerating, acdirc_path, fort_path, addField, addFieldMask);
            if ( addFieldGeneratingResult == 0 ) {
                System.out.println("当日增水场数据生成成功");
            } else {
                System.out.println(addFieldGeneratingResult);
            }
        }
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        writer.println("Log message: Field data processed successfully at " + LocalDateTime.now());
        System.out.println("Log message: Field data processed successfully at " + LocalDateTime.now());
    }
}

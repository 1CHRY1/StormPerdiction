package nnu.edu.station.common.config;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import nnu.edu.station.common.exception.MyException;
import nnu.edu.station.common.result.ResultEnum;
import nnu.edu.station.common.utils.FieldUtil;
import nnu.edu.station.common.utils.FileUtil;
import nnu.edu.station.common.utils.PredictionUtil;
import nnu.edu.station.common.utils.ProcessUtil;
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

    @Value("${updateData}")
    String updateData;

    @Value("${clawingCloud}")
    String clawingCloud;

    @Value("${clawingRadar}")
    String clawingRadar;

    @Value("${clawingRainfall}")
    String clawingRainfall;

    @Value("${clawingRainfallpre}")
    String clawingRainfallpre;

    @Value("${deleteClawingData}")
    String deleteClawingData;

    @Value("${TxtBuilder4flow}")
    String txtBuilder4flow;

    @Value("${TxtBuilder4wind}")
    String txtBuilder4wind;

    @Value("${TxtBuilder4zeta}")
    String txtBuilder4add;

    @Value("${Triangle}")
    String triangle;

    @Value("${DeleteFileData}")
    String deleteFileData;

    @Value("${DataProcessLog}")
    String logPath;

    @Autowired
    LevelService levelService;

    @Autowired
    NCService ncService;

//    @Scheduled(cron = "0/5 * * * * *")
    @Scheduled(cron = "0 0 4 * * ?")
    public void executePythonUpdateData() {
        // 每日更新站点数据
        try {
//            List<String> commands = new ArrayList<>();
//            commands.add(python);
//            commands.add(DataProcess + "DataProcess.py");
//            Process start = ProcessUtil.exeProcess(commands);
//            ProcessUtil.readProcessOutput(start.getInputStream(), System.out);
//            start.waitFor();
            Runtime.getRuntime().exec(python + " "  + updateData);
            // 添加日志输出
            log.info("Data updated successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Data updated successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Data updated successfully");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Scheduled(cron = "0 5 */2 * * ?")
    public void executePythonClawingCloudData() {
        // 爬取卫星云图数据
        try {
            Runtime.getRuntime().exec(python + " " + clawingCloud);
            // 添加日志输出
            log.info("Cloud Data clawed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Data updated successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Cloud Data clawed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Scheduled(cron = "0 20 */2 * * ?")
    public void executePythonClawingRadarData() {
        // 爬取雷达拼图数据
        try {
            Runtime.getRuntime().exec(python + " " + clawingRadar);
            // 添加日志输出
            log.info("Radar Data clawed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Data updated successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Radar Data clawed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Scheduled(cron = "0 35 */2 * * ?")
    public void executePythonClawingRainfallData() {
        // 爬取降水量实况数据
        try {
            Runtime.getRuntime().exec(python + " " + clawingRainfall);
            // 添加日志输出
            log.info("Rainfall Data clawed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Data updated successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Rainfall Data clawed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Scheduled(cron = "00 50 */2 * * ?")
    public void executePythonClawingRainfallpreData() {
        // 爬取降水量预报数据
        try {
            Runtime.getRuntime().exec(python + " " + clawingRainfallpre);
            // 添加日志输出
            log.info("Rainfallpre Data clawed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Data updated successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Rainfallpre Data clawed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Scheduled(cron = "00 55 5 * * ?")
    public void executePythonDeleteClawingData() {
        // 删除过期数据
        try {
            Runtime.getRuntime().exec(python + " " + deleteClawingData);
            // 添加日志输出
            log.info("Data deleted successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Data deleted successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Data deleted clawed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 5 * * ?")
    public void executePythonFieldProcessingData() {
        // 删除上一天流场数据(当前文件夹所存储的)
        FieldUtil.executePythonDeleteFieldData(python, logPath, deleteFileData);
        // 计算当天流场数据
        LocalDateTime time = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        Integer iftyph = levelService.ifTyph(time_str);
        String acdirc_path = ncService.getPathByTimeAndType(time_str, "acdirc");
        // 执行py文件生成txt
        FieldUtil.executePythonTxtBuilder4flow(python ,logPath ,txtBuilder4flow, acdirc_path);
        if ( iftyph == 1 ) {
            FieldUtil.executePythonTxtBuilder4wind(python ,logPath ,txtBuilder4wind, acdirc_path);
            String fort_path = ncService.getPathByTimeAndType(time_str, "fort63");
            FieldUtil.executePythonTxtBuilder4add(python ,logPath ,txtBuilder4add, acdirc_path, fort_path);
            FieldUtil.executePythonTriangle(python, logPath, triangle);
        }
        // 执行c++文件生成json
    }

}

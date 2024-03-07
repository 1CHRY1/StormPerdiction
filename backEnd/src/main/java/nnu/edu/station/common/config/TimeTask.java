package nnu.edu.station.common.config;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.sun.xml.internal.ws.policy.privateutil.PolicyUtils;
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

    @Value("${clawingTyphoon}")
    String clawingTyphoon;

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

    @Value("${CppExecution}")
    String cppExecution;

    @Value("${CppFlowFieldInputPath}")
    String cppFlowFieldInputPath;

    @Value("${CppFlowFieldJsonPath}")
    String cppFlowFieldJsonPath;

    @Value("${CppWindFieldInputPath}")
    String cppWindFieldInputPath;

    @Value("${CppWindFieldJsonPath}")
    String cppWindFieldJsonPath;

    @Value("${FlowField}")
    String FlowField;

    @Value("${WindField}")
    String WindField;

    @Value("${AddField}")
    String AddField;

    @Value("${DataProcessLog}")
    String logPath;

    @Autowired
    LevelService levelService;

    @Autowired
    NCService ncService;

//    @Scheduled(cron = "0/5 * * * * *")
    @Scheduled(cron = "0 0 4 * * ?")
    public void executePythonUpdateData() throws IOException {
        // 每日更新站点数据
        UpdateUtil.DataUpdating(python, updateData, logPath);
    }

    @Scheduled(cron = "0 10 */2 * * ?")
    public void executePythonClawingCloudData() throws IOException {
        // 爬取卫星云图数据
        ClawingUtil.ClawingCloudData(python, clawingCloud, logPath);
    }

    @Scheduled(cron = "0 30 */2 * * ?")
    public void executePythonClawingRadarData() throws IOException {
        // 爬取雷达拼图数据
        ClawingUtil.ClawingRadarData(python, clawingRadar, logPath);
    }

    @Scheduled(cron = "0 50 */2 * * ?")
    public void executePythonClawingRainfallData() throws IOException {
        // 爬取降水量实况数据
        ClawingUtil.ClawingRainfallData(python, clawingRainfall, logPath);
    }

    @Scheduled(cron = "0 0 9 * * ?")
    public void executePythonClawingRainfallpreData() throws IOException {
        // 爬取降水量预报数据
        ClawingUtil.ClawingRainfallpreData(python, clawingRainfallpre, logPath);
    }

    @Scheduled(cron = "0 0 10 * * ?")
    public void  executePythonClawingTyphoonData() throws IOException {
        // 爬取当日台风数据
        ClawingUtil.ClawingTyphoonData(python, clawingTyphoon, logPath);
    }

    @Scheduled(cron = "00 55 5 * * ?")
    public void executePythonDeleteClawingData() throws IOException {
        // 删除过期数据
        ClawingUtil.DeleteClawingData(python, deleteClawingData, logPath);
    }

    @Scheduled(cron = "10 40 09 * * ?")
    public void executePythonFieldProcessingData() throws IOException {
        // 删除上一天流场数据(当前文件夹所存储的)
        FieldUtil.executePythonDeleteFieldData(python, logPath, deleteFileData);
        // 计算当天流场数据
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        time = time.withYear(2023).withMonth(8).withDayOfMonth(31);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        Integer iftyph = levelService.ifTyph(time_str);
        String acdirc_path = '"' + ncService.getPathByTimeAndType(time_str, "adcirc") + '"';
        // 执行py文件生成流场txt
        int TxtBuilder4flowResult = FieldUtil.executePythonTxtBuilder4flow(python ,logPath ,txtBuilder4flow, acdirc_path);
        if ( TxtBuilder4flowResult == 0 ){
            // 执行cpp文件生成流场纹理
            FieldUtil.executeCppFlowField(cppExecution, cppFlowFieldJsonPath, cppFlowFieldInputPath, FlowField, logPath);
        } else {
            return;
        }
        if ( iftyph == 1 ) {
            // 执行py文件生成风场txt
            int TxtBuilder4windResult = FieldUtil.executePythonTxtBuilder4wind(python ,logPath ,txtBuilder4wind, acdirc_path);
            if ( TxtBuilder4windResult == 0 ) {
                // 执行cpp文件生成风场纹理
                FieldUtil.executeCppWindField(cppExecution, cppWindFieldJsonPath, cppWindFieldInputPath, WindField, logPath);
            }
            String fort_path =  '"' + ncService.getPathByTimeAndType(time_str, "fort63") + '"';
            // 执行py文件生成憎水场txt
            int TxtBuilder4addResult = FieldUtil.executePythonTxtBuilder4add(python ,logPath ,txtBuilder4add, acdirc_path, fort_path);
            if ( TxtBuilder4addResult == 0 ){
                FieldUtil.executePythonTriangle(python, logPath, triangle, AddField);
            }
        }
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        writer.println("Log message: Field data processed successfully at " + LocalDateTime.now());
        System.out.println("Log message: Field data processed successfully at " + LocalDateTime.now());
    }

}

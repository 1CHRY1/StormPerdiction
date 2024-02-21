package nnu.edu.station.common.config;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import nnu.edu.station.common.exception.MyException;
import nnu.edu.station.common.result.ResultEnum;
import nnu.edu.station.common.utils.FileUtil;
import nnu.edu.station.common.utils.PredictionUtil;
import nnu.edu.station.common.utils.ProcessUtil;
import nnu.edu.station.dao.level.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
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

    @Value("${DataProcess}")
    String DataProcess;

    @Value("${DataProcessLog}")
    String logPath;

//    @Scheduled(cron = "0/5 * * * * *")
    @Scheduled(cron = "0 0 12 * * ?")
    public void executePythonJiangsu() {
        try {
            List<String> commands = new ArrayList<>();
            commands.add(python);
            commands.add(DataProcess + "DataProcess.py");
            Process start = ProcessUtil.exeProcess(commands);
            ProcessUtil.readProcessOutput(start.getInputStream(), System.out);
            start.waitFor();
            // 添加日志输出
            log.info("Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Python script execution scheduled at " + LocalDateTime.now());
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

}

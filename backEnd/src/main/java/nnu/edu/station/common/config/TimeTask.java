package nnu.edu.station.common.config;

import lombok.extern.slf4j.Slf4j;
import nnu.edu.station.common.utils.*;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

    @Value("${DataProcessLog}")
    String logPath;

    @Autowired
    LevelService levelService;


//    @Scheduled(cron = "0/5 * * * * *")
    @Scheduled(cron = "0 0 16 * * ?")
    public void executePythonUpdateData() throws IOException {
        // 每日更新站点数据
        UpdateUtil.DataUpdating(python, updateData, dataprocess, logPath);
    }
}

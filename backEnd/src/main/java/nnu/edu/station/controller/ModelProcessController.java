package nnu.edu.station.controller;

import com.alibaba.fastjson2.JSONObject;
import nnu.edu.station.common.result.JsonResult;
import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.LevelService;
import nnu.edu.station.service.ModelProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/4/20 15:00
 * @Description:
 */

@RestController
@RequestMapping("api/v1/process/model")
public class ModelProcessController {

    @Value("${DirectoryPath}")
    String directoryPath;

    @Value("${ScriptName}")
    String scriptName;

    @Autowired
    ModelProcessService modelProcessService;
    @GetMapping("/run/once")
    public JsonResult run() throws IOException, InterruptedException {
        // 判断系统类型
        return ResultUtils.success(modelProcessService.run());
    }
}

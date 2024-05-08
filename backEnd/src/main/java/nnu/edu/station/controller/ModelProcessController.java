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
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    ModelProcessService modelProcessService;
    @GetMapping("/run/once")
    public JsonResult runOnce() throws IOException, InterruptedException {
        return ResultUtils.success(modelProcessService.runOnce());
    }

    @GetMapping("/run/once/condition")
    public JsonResult runOnceCondition() {
        // 查看单次任务运行状态
        return ResultUtils.success(modelProcessService.runOnceCondition());
    }

    @GetMapping ("/run/regular")
    public JsonResult RunRegular() {
        return ResultUtils.success(modelProcessService.runRegular());
    }

    @GetMapping("/run/regular/condition")
    public JsonResult RunRegularCondition() {
        return ResultUtils.success(modelProcessService.runRegularCondition());
    }

    @GetMapping ("/run/regular/stop")
    public JsonResult StopRunRegular() {
        return ResultUtils.success(modelProcessService.stopRunRegular());
    }
}

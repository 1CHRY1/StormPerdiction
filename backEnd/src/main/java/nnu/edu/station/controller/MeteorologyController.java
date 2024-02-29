package nnu.edu.station.controller;

import nnu.edu.station.common.result.JsonResult;
import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.LevelService;
import nnu.edu.station.service.MeteorologyService;
import org.apache.tomcat.util.http.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.Map;

/**
 * @projectName: backEnd
 * @package:
 * @className: MeteorologyController
 * @author: Chry
 * @description: TODO
 * @date: 2024/2/25 11:09
 * @version: 1.0
 */

@RestController
@RequestMapping("api/v1/data/meteorology")
public class MeteorologyController {

    @Autowired
    MeteorologyService meteorologyService;

    @GetMapping
    public JsonResult getAll() {
        /* 获取所有已有气象产品信息 */
        return ResultUtils.success(meteorologyService.getAll());
    }

    @GetMapping("/cloud")
    public JsonResult getCloud() {
        /* 获取卫星云图 */
        return ResultUtils.success(meteorologyService.getCloud());
    }

    @GetMapping("/radar")
    public JsonResult getRadar() {
        /* 获取雷达拼图 */
        return ResultUtils.success(meteorologyService.getRadar());
    }

    @GetMapping("/rainfall")
    public JsonResult getRainfall() {
        /* 获取降水量实况图 */
        return ResultUtils.success(meteorologyService.getRainfall());
    }

    @GetMapping("/rainfallpre")
    public JsonResult getRainfallpre() {
        /* 获取降水量预报图 */
        return ResultUtils.success(meteorologyService.getRainfallpre());
    }

    @GetMapping("/time&type")
    public ResponseEntity<FileSystemResource> getInfoByTimeAndType(@RequestParam String time, @RequestParam String type1, @RequestParam String type2, @RequestParam String type3) {
        Map<String,String> fileInfo = (Map<String,String>) meteorologyService.getInfoByTimeAndType(time, type1, type2, type3);
        String filePath = fileInfo.get("path");
        File file = new File(filePath);
        String fileName = file.getName();
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + fileName);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/jpeg"); // 根据实际文件类型设置

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(new FileSystemResource(file));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

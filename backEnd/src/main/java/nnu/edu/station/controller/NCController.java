package nnu.edu.station.controller;

import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.NCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.util.Map;

@RestController
@RequestMapping("/NC")
public class NCController {

    @Autowired
    NCService ncService;

    @RequestMapping(value = "/getInfoByTimeAndType/{time}/{type}", method = RequestMethod.GET)
    public ResponseEntity<FileSystemResource> getInfoByTimeAndType(@PathVariable String time, @PathVariable Integer type) {
        Map<String, String> fileInfo = ncService.getInfoByTimeAndType(time, type);
        String filePath = fileInfo.get("path");
        String fileName = fileInfo.get("name");
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/x-netcdf"); // 根据实际文件类型设置

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

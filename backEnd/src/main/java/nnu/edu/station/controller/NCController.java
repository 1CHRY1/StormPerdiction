package nnu.edu.station.controller;

import nnu.edu.station.common.result.JsonResult;
import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.NCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/data/nc")
public class NCController {

    @Value("${FlowField}")
    String FlowField;

    @Value("${WindField}")
    String WindField;

    @Value("${AddField}")
    String AddField;

    @Autowired
    NCService ncService;

    @GetMapping("/txt")
    public JsonResult getTxtDataByTime() {
        return ResultUtils.success(ncService.getTxtDataByTime());
    }

    @GetMapping
    public JsonResult getInfoByTime() {
        return ResultUtils.success(ncService.getAll());
    }

    @GetMapping("/path/time&type")
    public String getPathByTimeAndType(@RequestParam String time, @RequestParam String type) {
        return ncService.getPathByTimeAndType(time,type);
    }

    @GetMapping("content/time&type")
    public ResponseEntity<FileSystemResource> getInfoByTimeAndType(@RequestParam String time, @RequestParam String type) {
        Map<String,String> fileInfo = (Map<String,String>) ncService.getInfoByTimeAndType(time, type);
        String filePath = fileInfo.get("path");
        String fileName = fileInfo.get("name");
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + fileName);
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

    @GetMapping("/field/flow/bin")
    public ResponseEntity<FileSystemResource> getFlowJson(@RequestParam String name) {
        String filePath = FlowField + "/bin/" + name;
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream"); // 根据实际文件类型设置

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

    @GetMapping("/field/wind/bin")
    public ResponseEntity<FileSystemResource> getWindJson(@RequestParam String name) {
        String filePath = WindField + "/bin/" + name;
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream"); // 根据实际文件类型设置

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

    @GetMapping("/field/add/json")
    public ResponseEntity<FileSystemResource> getAddJson(@RequestParam String name) {
        String filePath = AddField + "/" + name;
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/geo+json"); // 根据实际文件类型设置

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

    @GetMapping("/field/add/pic")
    public ResponseEntity<FileSystemResource> getAddPic(@RequestParam String name) {
        String filePath = AddField + "/" + name;
        File file = new File(filePath);
        if (file.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置

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

//    @GetMapping("/field/add/9711/json")
//    public ResponseEntity<FileSystemResource> get9711AddJson(@RequestParam String name) {
//        String filePath = AddField9711 + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/geo+json"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @GetMapping("/field/add/9711/pic")
//    public ResponseEntity<FileSystemResource> get9711AddPic(@RequestParam String name) {
//        String filePath = AddField9711 + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/field/flow/pic")
//    public ResponseEntity<FileSystemResource> getFlowPic(@RequestParam String name) {
//        String filePath = FlowField + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/field/wind/pic")
//    public ResponseEntity<FileSystemResource> getWindPic(@RequestParam String name) {
//        String filePath = WindField + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/field/flow/9711/json")
//    public ResponseEntity<FileSystemResource> get9711FlowJson(@RequestParam String name) {
//        String filePath = FlowField9711 + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/json"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/field/wind/9711/json")
//    public ResponseEntity<FileSystemResource> get9711WindJson(@RequestParam String name) {
//        String filePath = WindField9711 + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/json"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/field/flow/9711/pic")
//    public ResponseEntity<FileSystemResource> get9711FlowPic(@RequestParam String name) {
//        String filePath = FlowField9711 + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @GetMapping("/field/wind/9711/pic")
//    public ResponseEntity<FileSystemResource> get9711WindPic(@RequestParam String name) {
//        String filePath = WindField9711 + "/" + name;
//        File file = new File(filePath);
//        if (file.exists()){
//            HttpHeaders headers = new HttpHeaders();
//            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; ftiilename=" + name);
//            headers.add(HttpHeaders.CONTENT_TYPE, "application/image/png"); // 根据实际文件类型设置
//
//            return ResponseEntity
//                    .ok()
//                    .headers(headers)
//                    .contentLength(file.length())
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(new FileSystemResource(file));
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

}

package nnu.edu.station.controller;

import nnu.edu.station.common.result.JsonResult;
import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.HTMLDocument;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("api/v1/data/level")
public class LevelController {

    @Autowired
    LevelService levelService;

    @GetMapping(value = "/typh")
    public JsonResult getIfTyph() {
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        return ResultUtils.success(levelService.ifTyph(time_str));
    }

    @GetMapping(value = "/station")
    public JsonResult getAllInfoByStation(@RequestParam String station) {
        /* 根据名称获取站点所有潮位预报信息 */
        return ResultUtils.success(levelService.getAllInfoByStation(station));
    }

    @GetMapping(value = "/station/real")
    public JsonResult get72RealInfoByStation(@RequestParam String station) throws IOException {
        /* 根据名称获取站点72小时实测潮位预报信息 */
        return ResultUtils.success(levelService.get72RealInfoByStation(station));
    }

    @GetMapping(value = "/station/before/72")
    public JsonResult getBefore72ByStation(@RequestParam String station) {
        /* 根据名称获取站点前72小时潮位预报信息 */
        return ResultUtils.success(levelService.getBefore72ByStation(station));
    }

    @GetMapping(value = "/station/72")
    public JsonResult get72ByStation(@RequestParam String station) {
        /* 根据名称获取站点当天无台风情况下72小时潮位预报信息 */
        return ResultUtils.success(levelService.get72ByStation(station));
    }

    @GetMapping(value = "/station/notyph/72")
    public JsonResult getNoTyph72ByStation(@RequestParam String station) {
        /* 根据名称获取站点当天无台风情况下72小时潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyph72ByStation(station));
    }

    @GetMapping(value = "/station/typh/72")
    public JsonResult getTyph72ByStation(@RequestParam String station) {
        /* 根据名称获取站点当天遭遇台风情况下72小时潮位预报信息 */
        return ResultUtils.success(levelService.getTyph72ByStation(station));
    }

    @GetMapping(value = "/station/notyph/all")
    public JsonResult getNoTyphAllByStation(@RequestParam String station){
        /* 根据名称获取站点所有无台风情况下所有潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyphAllByStation(station));
    }

    @GetMapping(value = "/station/typh/all")
    public JsonResult getTyphAllByStation(@RequestParam String station){
        /* 根据名称获取站点所有遭遇台风情况下所有潮位预报信息 */
        return ResultUtils.success(levelService.getTyphAllByStation(station));
    }

    @GetMapping(value ="/station/notyph/72/manual")
    public JsonResult getNoTyph72ManualByStation(@RequestParam String station) {
        /* 根据名称获取站点无台风情况下72小时手动计算潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyph72ManualByStation(station));
    }

    @GetMapping(value = "/station/typh/72/manual")
    public JsonResult getTyph72ManualByStation(@RequestParam String station) {
        /* 根据名称获取站点无台风情况下72小时手动计算潮位预报信息 */
        return ResultUtils.success(levelService.getTyph72ManualByStation(station));
    }

    @GetMapping(value = "/station/notyph/all/manual")
    public JsonResult getNoTyphAllManualByStation(@RequestParam String station){
        /* 根据名称获取站点无台风情况下所有手动计算潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyphAllManualByStation(station));
    }
}

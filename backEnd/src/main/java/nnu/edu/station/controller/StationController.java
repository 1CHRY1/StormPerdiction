package nnu.edu.station.controller;

import nnu.edu.station.common.result.JsonResult;
import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/data/station")
public class StationController {
    @Autowired
    StationService stationService;

    @GetMapping("/name")
    public JsonResult getInfoByName(@RequestParam String name){
        return ResultUtils.success(stationService.getInfoByName(name));
    }

    @GetMapping
    public JsonResult getAllStations() {
        /* 获取全部站点名称 */
        return ResultUtils.success(stationService.getAllStations());
    }

    // 有点问题
    @GetMapping("/today")
    public JsonResult getTodayStation() {
        /* 获取当天有数据的站点 */
        return ResultUtils.success(stationService.getTodayStation());
    }

    @GetMapping("/today/forecast")
    public JsonResult getTodayStationForecast() {
        /* 获取当天有数据的站点 */
        return ResultUtils.success(stationService.getTodayStationForecast());
    }

    @GetMapping("/today/precise")
    public JsonResult getTodayStationPrecise() {
        /* 获取当天有数据的站点 */
        return ResultUtils.success(stationService.getTodayStationPrecise());
    }

    @GetMapping("/today/real")
    public JsonResult getTodayStationReal() {
        /* 获取当天有数据的站点 */
        return ResultUtils.success(stationService.getTodayStationReal());
    }
}

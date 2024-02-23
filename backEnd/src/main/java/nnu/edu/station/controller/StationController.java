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
}

package nnu.edu.station.controller;

import nnu.edu.station.common.result.JsonResult;
import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Station")
public class StationController {
    @Autowired
    StationService stationService;

    @RequestMapping(value="/getInfoByName/{name}",method = RequestMethod.GET)
    public JsonResult getInfoByName(@PathVariable String name){
        return ResultUtils.success(stationService.getInfoByName(name));
    }

    @RequestMapping(value = "/getAllStations", method = RequestMethod.GET)
    public JsonResult getAllStations() {
        /* 获取全部站点名称 */
        return ResultUtils.success(stationService.getAllStations());
    }
}

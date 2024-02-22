package nnu.edu.station.controller;

import nnu.edu.station.common.result.JsonResult;
import nnu.edu.station.common.result.ResultUtils;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.swing.text.html.HTMLDocument;
import java.util.List;

@RestController
@RequestMapping("/Level")
public class LevelController {

    @Autowired
    LevelService levelService;

    @RequestMapping(value = "/getAllInfoByStation/{station}", method = RequestMethod.GET)
    public JsonResult getAllInfoByStation(@PathVariable String station) {
        /* 根据名称获取站点所有潮位预报信息 */
        return ResultUtils.success(levelService.getAllInfoByStation(station));
    }

    @RequestMapping(value = "/getNoTyph72ByStation/{station}", method = RequestMethod.GET)
    public JsonResult getNoTyph72ByStation(@PathVariable String station) {
        /* 根据名称获取站点无台风情况下72小时手动计算潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyph72ByStation(station));
    }

    @RequestMapping(value = "/getTyph72ByStation/{station}", method = RequestMethod.GET)
    public JsonResult getTyph72ByStation(@PathVariable String station) {
        /* 根据名称获取站点遭遇台风情况下72小时潮位预报信息 */
        return ResultUtils.success(levelService.getTyph72ByStation(station));
    }

    @RequestMapping(value = "/getNoTyphAllByStation/{station}", method = RequestMethod.GET)
    public JsonResult getNoTyphAllByStation(@PathVariable String station){
        /* 根据名称获取站点无台风情况下所有潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyphAllByStation(station));
    }

    @RequestMapping(value =


            "/getNoTyph72ManualByStation/{station}", method = RequestMethod.GET)
    public JsonResult getNoTyph72ManualByStation(@PathVariable String station) {
        /* 根据名称获取站点无台风情况下72小时手动计算潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyph72ManualByStation(station));
    }

    @RequestMapping(value = "/getTyph72ManualByStation/{station}", method = RequestMethod.GET)
    public JsonResult getTyph72ManualByStation(@PathVariable String station) {
        /* 根据名称获取站点无台风情况下72小时手动计算潮位预报信息 */
        return ResultUtils.success(levelService.getTyph72ManualByStation(station));
    }

    @RequestMapping(value = "/getNoTyphAllManualByStation/{station}", method = RequestMethod.GET)
    public JsonResult getNoTyphAllManualByStation(@PathVariable String station){
        /* 根据名称获取站点无台风情况下所有手动计算潮位预报信息 */
        return ResultUtils.success(levelService.getNoTyphAllManualByStation(station));
    }
}

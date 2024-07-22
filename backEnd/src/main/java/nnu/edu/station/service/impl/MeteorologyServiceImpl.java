package nnu.edu.station.service.impl;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import nnu.edu.station.common.utils.FileUtil;
import nnu.edu.station.common.utils.HttpUtil;
import nnu.edu.station.dao.meteorology.MeteorologyMapper;
import nnu.edu.station.service.MeteorologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.management.ObjectName;
import java.util.List;

/**
 * @projectName: backEnd
 * @package:
 * @className: MeteorologyServiceImpl
 * @author: Chry
 * @description: TODO
 * @date: 2024/2/25 11:07
 * @version: 1.0
 */

@Service
public class MeteorologyServiceImpl implements MeteorologyService {

    @Value("${Typhoon}")
    String typhoon;

    @Value("${TyphoonUrl}")
    String typhoonUrl;

    @Autowired
    MeteorologyMapper meteorologyMapper;

    @Override
    public List<Object> getAll() {
        return meteorologyMapper.getAll();
    }

    @Override
    public List<Object> getCloud() {
        return meteorologyMapper.getCloud();
    }

    @Override
    public List<Object> getRadar() {
        return meteorologyMapper.getRadar();
    }

    @Override
    public List<Object> getRainfall() {
        return meteorologyMapper.getRainfall();
    }

    @Override
    public List<Object> getRainfallpre() {
        return meteorologyMapper.getRainfallpre();
    }

    @Override
    public Object getTyphoon() {
        JSONObject typhoonJson = new JSONObject();
        try {
            typhoonJson = FileUtil.readJsonObjectFile(typhoon);
        } catch (Exception e) {
            return typhoonJson;
        }
        return typhoonJson;
    }

    @Override
    public Object getInfoByTimeAndType(String time, String type1, String type2, String type3){
        return meteorologyMapper.getInfoByTimeAndType(time, type1, type2, type3);
    }

    @Override
    public Object getTyphoonByYear(String year) {
        String Url = typhoonUrl + "Api/TyphoonList/" + year;
        String response = HttpUtil.GetRealData4Typhoon(Url);
        return response;
    }

    @Override
    public Object getTyphoonByTid(String tid) {
        String Url = typhoonUrl + "Api/TyphoonInfo/" + tid;
        JSONObject response = HttpUtil.GetRealData(Url);
        return response;
    }
}

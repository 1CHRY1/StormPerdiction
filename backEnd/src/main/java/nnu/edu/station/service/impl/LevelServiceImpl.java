package nnu.edu.station.service.impl;

import nnu.edu.station.common.utils.ListUtil;
import nnu.edu.station.dao.level.LevelMapper;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LevelServiceImpl implements LevelService {

    @Autowired
    LevelMapper LevelMapper;

    @Override
    public List<Map<String, Object>> getAllInfoByStation(String station) {
        return LevelMapper.getAllInfoByStation(station);
    }

    @Override
    public List<Map<String, Object>> getNoTyph72ByStation(String station) {
        List<Map<String, Object>> objs = LevelMapper.getNoTyph72ByStation(station);
        for (Map<String, Object> obj : objs){
            String hpre_str = (String) obj.get("hpre");
            List<Double> hpre = ListUtil.String2Array(hpre_str);
            obj.replace("hpre",hpre);
        }
        return objs;
    }

    @Override
    public List<Map<String, Object>> getTyph72ByStation(String station) {
        return  LevelMapper.getTyph72ByStation(station);
    }

    @Override
    public List<Map<String, Object>> getNoTyphAllByStation(String station) {
        return  LevelMapper.getNoTyphAllByStation(station);
    }

    @Override
    public List<Map<String, Object>> getNoTyph72ManualByStation(String station) {
        return  LevelMapper.getNoTyph72ManualByStation(station);
    }

    @Override
    public List<Map<String, Object>> getTyph72ManualByStation(String station) {
        return  LevelMapper.getTyph72ManualByStation(station);
    }

    @Override
    public List<Map<String, Object>> getNoTyphAllManualByStation(String station) {
        return  LevelMapper.getNoTyphAllManualByStation(station);
    }
}

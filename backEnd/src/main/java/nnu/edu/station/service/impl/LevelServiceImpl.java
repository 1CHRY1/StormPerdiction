package nnu.edu.station.service.impl;

import nnu.edu.station.dao.level.LevelMapper;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public List<Float> getNoTyph72ByStation(String station) {
        return  LevelMapper.getNoTyph72ByStation(station);
    }

    @Override
    public List<Float> getTyph72ByStation(String station) {
        return  LevelMapper.getTyph72ByStation(station);
    }

    @Override
    public List<Float> getNoTyphAllByStation(String station) {
        return  LevelMapper.getNoTyphAllByStation(station);
    }

    @Override
    public List<Float> getNoTyph72ManualByStation(String station) {
        return  LevelMapper.getNoTyph72ManualByStation(station);
    }

    @Override
    public List<Float> getTyph72ManualByStation(String station) {
        return  LevelMapper.getTyph72ManualByStation(station);
    }

    @Override
    public List<Float> getNoTyphAllManualByStation(String station) {
        return  LevelMapper.getNoTyphAllManualByStation(station);
    }
}

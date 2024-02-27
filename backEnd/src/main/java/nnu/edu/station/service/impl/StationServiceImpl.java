package nnu.edu.station.service.impl;

import nnu.edu.station.dao.level.StationMapper;
import nnu.edu.station.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StationServiceImpl implements StationService {

    @Autowired
    StationMapper StationMapper;

    @Override
    public Object getInfoByName(String name) {
        return StationMapper.getInfoByName(name);
    }

    @Override
    public List<Object> getAllStations(){
        return StationMapper.getAllStations();
    }
}

package nnu.edu.station.service.impl;

import nnu.edu.station.dao.nc.NCMapper;
import nnu.edu.station.service.NCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class NCServiceImpl implements NCService {

    @Autowired
    NCMapper ncMapper;

    @Override
    public List<String> getAll() {
        return ncMapper.getAll();
    }

    @Override
    public Map<String, String> getInfoByTimeAndType(String time, String type) {
        return ncMapper.getInfoByTimeAndType(time, type);
    }
}

package nnu.edu.station.service.impl;

import nnu.edu.station.common.utils.FileUtil;
import nnu.edu.station.dao.nc.NCMapper;
import nnu.edu.station.service.NCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class NCServiceImpl implements NCService {

    @Autowired
    NCMapper ncMapper;

    @Override
    public List<List<String>> getTxtDataByTime(String time) {
        String filePath = ncMapper.getTxtPathByTime(time);
        if (filePath == null){
            return new ArrayList<>();
        } else {
            List<List<String>> txt = FileUtil.readTxtFile(filePath);
            return txt;
        }
    }

    @Override
    public List<Object> getAll() {
        return ncMapper.getAll();
    }

    @Override
    public String getPathByTimeAndType(String time, String type){
        return ncMapper.getPathByTimeAndType(time, type);
    }

    @Override
    public Object getInfoByTimeAndType(String time, String type) {
        return ncMapper.getInfoByTimeAndType(time, type);
    }
}

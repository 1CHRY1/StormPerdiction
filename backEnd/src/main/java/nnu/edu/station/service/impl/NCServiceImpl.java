package nnu.edu.station.service.impl;

import nnu.edu.station.common.utils.FileUtil;
import nnu.edu.station.dao.nc.NCMapper;
import nnu.edu.station.service.NCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class NCServiceImpl implements NCService {

    @Autowired
    NCMapper ncMapper;

    @Override
    public List<List<String>> getTxtDataByTime() {
        LocalDateTime time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String time_str = time.format(formatter);
        String filePath = ncMapper.getTxtPathByTime(time_str);
        if (filePath == null){
            // 若当天数据未更新，则获取前一天的数据
            time = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0).minusDays(1);
            time_str = time.format(formatter);
            filePath = ncMapper.getTxtPathByTime(time_str);
            if ( filePath == null )
                return new ArrayList<>();
            else {
                List<List<String>> txt = FileUtil.readTxtFile(filePath);
                return txt;
            }
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

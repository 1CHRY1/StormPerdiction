package nnu.edu.station.service.impl;

import nnu.edu.station.dao.meteorology.MeteorologyMapper;
import nnu.edu.station.service.MeteorologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public Object getInfoByTimeAndType(String time, String type1, String type2, String type3){
        return meteorologyMapper.getInfoByTimeAndType(time, type1, type2, type3);
    }
}

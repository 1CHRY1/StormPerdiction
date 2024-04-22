package nnu.edu.station.dao.level;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@MapperScan
public interface StationMapper {
    Object getInfoByName(@Param("name") String name);

    List<Object> getAllStations();

    Map<String,Object> getStationByNameAndTime(@Param("station") String station, @Param("time") String time);
}

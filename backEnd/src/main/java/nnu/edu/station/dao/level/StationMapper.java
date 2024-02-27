package nnu.edu.station.dao.level;

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
}

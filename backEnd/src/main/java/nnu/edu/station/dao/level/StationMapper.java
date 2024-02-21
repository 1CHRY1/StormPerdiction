package nnu.edu.station.dao.level;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface StationMapper {
    Map<String, Object> getInfoByName(@Param("name") String name);

    List<String> getAllStations();
}

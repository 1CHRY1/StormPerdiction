package nnu.edu.station.dao.level;

import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@MapperScan
public interface LevelMapper {
    List<Map<String, Object>> getAllInfoByStation(@Param("station") String station);

    List<Map<String, Object>> getNoTyph72ByStation(@Param("station") String station);

    List<Map<String, Object>> getTyph72ByStation(@Param("station") String station);

    List<Map<String, Object>> getNoTyphAllByStation(@Param("station") String station);

    List<Map<String, Object>> getNoTyph72ManualByStation(@Param("station") String station);

    List<Map<String, Object>> getTyph72ManualByStation(@Param("station") String station);

    List<Map<String, Object>> getNoTyphAllManualByStation(@Param("station") String station);
}

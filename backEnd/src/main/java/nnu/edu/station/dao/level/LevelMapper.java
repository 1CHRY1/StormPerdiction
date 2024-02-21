package nnu.edu.station.dao.level;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface LevelMapper {
    List<Map<String, Object>> getAllInfoByStation(@Param("station") String station);

    List<Float> getNoTyph72ByStation(@Param("station") String station);

    List<Float> getTyph72ByStation(@Param("station") String station);

    List<Float> getNoTyphAllByStation(@Param("station") String station);

    List<Float> getNoTyph72ManualByStation(@Param("station") String station);

    List<Float> getTyph72ManualByStation(@Param("station") String station);

    List<Float> getNoTyphAllManualByStation(@Param("station") String station);
}

package nnu.edu.station.dao.level;

import net.sf.jsqlparser.expression.DateTimeLiteralExpression;
import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
@MapperScan
public interface LevelMapper {
    List<Map<String, Object>> getAllInfoByStation(@Param("station") String station);

    List<Map<String, Object>> getNoTyphAllByStation(@Param("station") String station);

    List<Map<String, Object>> getTyphAllByStation(@Param("station") String station);

    Integer ifTyph(@Param("time") String time);

    List<Map<String, Double>> getBefore72ByStation(@Param("station") String station, @Param("beforetime") String beforetime, @Param("currenttime") String currenttime);

    Map<String, Object> getNoTyph72ByStation(@Param("station") String station, @Param("time") String time);

    Map<String, Object> getTyph72ByStation(@Param("station") String station, @Param("time") String time);

    List<Map<String, Object>> getNoTyph72ManualByStation(@Param("station") String station);

    List<Map<String, Object>> getTyph72ManualByStation(@Param("station") String station);

    List<Map<String, Object>> getNoTyphAllManualByStation(@Param("station") String station);
}

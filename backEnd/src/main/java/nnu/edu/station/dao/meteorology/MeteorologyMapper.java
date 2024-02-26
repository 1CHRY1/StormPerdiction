package nnu.edu.station.dao.meteorology;

import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@MapperScan
public interface MeteorologyMapper {
    List<Object> getAll();

    List<Object> getCloud();

    List<Object> getRadar();

    List<Object> getRainfall();

    List<Object> getRainfallpre();

    Object getInfoByTimeAndType(@Param("time") String time, @Param("type1") String type1, @Param("type2") String type2, @Param("type3") String type3);
}

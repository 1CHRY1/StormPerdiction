package nnu.edu.station.dao.nc;

import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@MapperScan
public interface NCMapper {

    String getTxtPathByTime(@Param("time") String time);

    List<Object> getAll();

    String getPathByTimeAndType(@Param("time") String time, @Param("type") String type);

    Object getInfoByTimeAndType(@Param("time") String time, @Param("type") String type);
}

package nnu.edu.station.dao.nc;

import org.apache.ibatis.annotations.Param;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@MapperScan
public interface NCMapper {

    List<String> getAll();
    Map<String, String> getInfoByTimeAndType(@Param("time") String time, @Param("type") String type);
}

package nnu.edu.station.common.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

/**
 * @projectName: backEnd
 * @package:
 * @className: MeteorologyDataSourceConfig
 * @author: Chry
 * @description: TODO
 * @date: 2024/2/25 10:47
 * @version: 1.0
 */

@Configuration
@MapperScan(basePackages = "nnu.edu.station.dao.meteorology", sqlSessionTemplateRef  = "meteorologySqlSessionTemplate")
public class MeteorologyDataSourceConfig {
    @Bean(name = "meteorologyDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.meteorology")
    @Primary
    public DataSource testDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "meteorologySqlSessionFactory")
    @Primary
    public SqlSessionFactory testSqlSessionFactory(@Qualifier("meteorologyDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();

        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/meteorology/*.xml"));
        bean.getObject().getConfiguration().setCallSettersOnNulls(true);
        return bean.getObject();
    }

    @Bean(name = "meteorologyTransactionManager")
    @Primary
    public DataSourceTransactionManager testTransactionManager(@Qualifier("meteorologyDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "meteorologySqlSessionTemplate")
    @Primary
    public SqlSessionTemplate testSqlSessionTemplate(@Qualifier("meteorologySqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
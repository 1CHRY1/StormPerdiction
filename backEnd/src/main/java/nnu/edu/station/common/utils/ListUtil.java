package nnu.edu.station.common.utils;

import net.lingala.zip4j.ZipFile;
import nnu.edu.station.common.exception.MyException;
import nnu.edu.station.common.result.ResultEnum;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @projectName: backEnd
 * @package:
 * @className: ListUtil
 * @author: Chry
 * @description: TODO
 * @date: 2024/2/25 20:36
 * @version: 1.0
 */
public class ListUtil {
    public static List<Double> String2Array(String string) {
        string = string.replaceAll("[\\[\\]\\s]", "");
        String[] elements = string.split(",");
        List<Double> result = new ArrayList<>();
        for (String element : elements) {
            result.add(Double.parseDouble(element));
        }
        return result;
    }

    public static  List<Map<String, Object>> StringObjList2ArrayObjList(List<Map<String, Object>> objs) {
        for (Map<String, Object> obj : objs){
            String hpre_str = (String) obj.get("hpre");
            String hyubao_str = (String) obj.get("hyubao");
            String hadd_str = (String) obj.get("hadd");
            if ( hpre_str != null ) {
                List<Double> hpre = ListUtil.String2Array(hpre_str);
                obj.replace("hpre",hpre);
            }
            if ( hyubao_str != null ) {
                List<Double> hyubao = ListUtil.String2Array(hyubao_str);
                obj.replace("hyubao",hyubao);
            }
            if ( hadd_str != null ) {
                List<Double> hadd = ListUtil.String2Array(hadd_str);
                obj.replace("hadd",hadd);
            }
        }
        return objs;
    }

    public static  Map<String, Object> StringObj2ArrayObj(Map<String, Object> obj) {
        String hpre_str = (String) obj.get("hpre");
        String hyubao_str = (String) obj.get("hyubao");
        String hadd_str = (String) obj.get("hadd");
        if ( hpre_str != null ) {
            List<Double> hpre = ListUtil.String2Array(hpre_str);
            obj.replace("hpre",hpre);
        }
        if ( hyubao_str != null ) {
            List<Double> hyubao = ListUtil.String2Array(hyubao_str);
            obj.replace("hyubao",hyubao);
        }
        if ( hadd_str != null ) {
            List<Double> hadd = ListUtil.String2Array(hadd_str);
            obj.replace("hadd",hadd);
        }
        return obj;
    }
}

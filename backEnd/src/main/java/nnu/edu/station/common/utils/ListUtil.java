package nnu.edu.station.common.utils;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONException;
import com.alibaba.fastjson2.JSONObject;
import net.lingala.zip4j.ZipFile;
import net.sf.jsqlparser.expression.DateTimeLiteralExpression;
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
        // 特殊数据处理：字符串转列表
        string = string.replaceAll("[\\[\\]\\s]", "");
        String[] elements = string.split(",");
        List<Double> result = new ArrayList<>();
        for (String element : elements) {
            if ( element.equals("None") ) {
                result.add(0.0);
            }
            else {
                result.add(Double.parseDouble(element));
            }
        }
        return result;
    }

    public static  List<Map<String, Object>> StringObjList2ArrayObjList(List<Map<String, Object>> objs) {
        // 特殊数据处理：用于预测潮位数据
        for (Map<String, Object> obj : objs){
            try {
                String hpre_str = (String) obj.get("hpre");
                String hyubao_str = (String) obj.get("hyubao");
                String hadd_str = (String) obj.get("hadd");
                if (hpre_str != null) {
                    List<Double> hpre = ListUtil.String2Array(hpre_str);
                    obj.replace("hpre", hpre);
                }
                if (hyubao_str != null) {
                    List<Double> hyubao = ListUtil.String2Array(hyubao_str);
                    obj.replace("hyubao", hyubao);
                }
                if (hadd_str != null) {
                    List<Double> hadd = ListUtil.String2Array(hadd_str);
                    obj.replace("hadd", hadd);
                }
            } catch (Exception e) {}
            try {
                // V2字段
                String hshice_str = (String) obj.get("hshice");
                String hybresult_str = (String) obj.get("hybresult");
                if (hshice_str != null) {
                    List<Double> hpre = ListUtil.String2Array(hshice_str);
                    obj.replace("hshice", hpre);
                }
                if (hybresult_str != null) {
                    List<Double> hyubao = ListUtil.String2Array(hybresult_str);
                    obj.replace("hybresult", hyubao);
                }
            } catch (Exception e) {}
        }
        return objs;
    }

    public static  Map<String, Object> StringObj2ArrayObj(Map<String, Object> obj) {
        // 特殊数据处理：用于预测潮位数据
        try {
            // V1字段
            String hpre_str = (String) obj.get("hpre");
            String hyubao_str = (String) obj.get("hyubao");
            String hadd_str = (String) obj.get("hadd");
            if (hpre_str != null) {
                List<Double> hpre = ListUtil.String2Array(hpre_str);
                obj.replace("hpre", hpre);
            }
            if (hyubao_str != null) {
                List<Double> hyubao = ListUtil.String2Array(hyubao_str);
                obj.replace("hyubao", hyubao);
            }
            if (hadd_str != null) {
                List<Double> hadd = ListUtil.String2Array(hadd_str);
                obj.replace("hadd", hadd);
            }
        } catch (Exception e) {}
        try {
            // V2字段
            String hshice_str = (String) obj.get("hshice");
            String hybresult_str = (String) obj.get("hybresult");
            if (hshice_str != null) {
                List<Double> hpre = ListUtil.String2Array(hshice_str);
                obj.replace("hshice", hpre);
            }
            if (hybresult_str != null) {
                List<Double> hyubao = ListUtil.String2Array(hybresult_str);
                obj.replace("hybresult", hyubao);
            }
        } catch (Exception e) {}
        return obj;
    }

    public static JSONArray realDataProcessing(JSONArray realDataList) {
        // 处理真实潮位数据
        JSONArray realDataResultList = new JSONArray();
        for (int i = 0; i < realDataList.size(); i++) {
            JSONObject realData = realDataList.getJSONObject(i);
            String time = realData.getString("time");
            String level;
            if (realData.containsKey("waterLevel")) {
                level = realData.getString("waterLevel");
            } else if (realData.containsKey("upstreamWaterLevel")) {
                level = realData.getString("upstreamWaterLevel");
            } else {
                level = "";
            }
            JSONObject realDataResult = new JSONObject();
            realDataResult.put("time", time);
            realDataResult.put("level", level);
            realDataResultList.add(realDataResult);
        }
        return realDataResultList;
    }

    public static JSONArray realDataProcessingV2(JSONArray realDataList) {
        // 处理真实潮位数据（新增四个站点）
        JSONArray realDataResultList = new JSONArray();
        for (int i = 0; i < realDataList.size(); i++) {
            JSONObject realData = realDataList.getJSONObject(i);
            String time = realData.getString("time");
            String level = realData.getString("tideValue");

            JSONObject realDataResult = new JSONObject();
            realDataResult.put("time", time);
            realDataResult.put("level", level);
            realDataResultList.add(realDataResult);
        }
        return realDataResultList;
    }

}

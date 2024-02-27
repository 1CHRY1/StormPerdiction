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
}

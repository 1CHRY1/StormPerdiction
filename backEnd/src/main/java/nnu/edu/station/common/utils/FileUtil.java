package nnu.edu.station.common.utils;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import net.lingala.zip4j.ZipFile;
import nnu.edu.station.common.exception.MyException;
import nnu.edu.station.common.result.ResultEnum;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/02/08/14:36
 * @Description:
 */
public class FileUtil {
    public static void compressFile(String destination, List<String> addresses) {
        ZipFile zipFile = new ZipFile(destination);
        try {
            List<File> files = new ArrayList<>();
            for (String address : addresses) {
                files.add(new File(address));
            }
            zipFile.addFiles(files);
        } catch (Exception e) {
            System.out.println(e);
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    public static JSONArray readJsonArrayFile(String path) {
        try {
            InputStreamReader fReader = new InputStreamReader(new FileInputStream(path),"UTF-8");
            BufferedReader br = new BufferedReader(fReader);
            String jsonString = "";
            String line = "";
            while ((line = br.readLine()) != null) {
                jsonString += line;
            }
            fReader.close();
            br.close();
            return JSON.parseArray(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    public static JSONObject readJsonObjectFile(String path) {
        try {
            InputStreamReader fReader = new InputStreamReader(new FileInputStream(path),"UTF-8");
            BufferedReader br = new BufferedReader(fReader);
            String jsonString = "";
            String line = "";
            while ((line = br.readLine()) != null) {
                jsonString += line;
            }
            fReader.close();
            br.close();
            return JSON.parseObject(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    /**
    * @Description:文本文件缓存
    * @Author: Yiming
    * @Date: 2023/2/13
    */
    public static void saveFile(List<Map<String, Object>> list, String address, List<String> keys, List<String> keys_cn) {
        try {
            FileWriter fileWriter = new FileWriter(address);
            for (Map<String, Object> map : list) {
                String str = map.get("time").toString();
                for (String key : keys) {
                    str = str + "\t" + map.get(key);
                }
                str += "\n";
                fileWriter.write(str);
            }
            String temp = "";
            for (String s : keys_cn) {
                temp += s + "\t";
            }
//            fileWriter.write(temp);
            fileWriter.close();

        } catch (Exception e) {
            e.printStackTrace();
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    /**
    * @Description:文件追加写入
    * @Author: Yiming
    * @Date: 2023/6/12
    */
    public static void addFileContent(String content, String fileAddress) {
        File file = new File(fileAddress);
        FileOutputStream fileOutputStream;
        try {
            if (!file.exists()) {
                file.createNewFile();
                fileOutputStream = new FileOutputStream(file);
            } else {
                fileOutputStream = new FileOutputStream(file, true);
            }
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "utf-8");
            outputStreamWriter.write(content);
            outputStreamWriter.flush();
            outputStreamWriter.close();
            fileOutputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    public static void writeFile(String content, String fileAddress) {
        File file = new File(fileAddress);
        try {
            if (!file.exists()) file.createNewFile();
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "utf-8");
            outputStreamWriter.write(content);
            outputStreamWriter.flush();
            outputStreamWriter.close();
            fileOutputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
            throw new MyException(ResultEnum.DEFAULT_EXCEPTION);
        }
    }

    public static List<List<String>> readTxtFile(String filePath) {
        List<List<String>> result = new ArrayList<>();
        // 初始化列表
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), StandardCharsets.UTF_8))) {
            String line;
            // 读取标题行
            if ((line = br.readLine()) != null) {
                String[] headers = line.trim().split("\\s+");
                for (String header : headers) {
                    result.add(new ArrayList<>());
                    result.get(result.size() - 1).add(header);
                }
            }
            // 逐列读取数据
            while ((line = br.readLine()) != null) {
                String[] parts = line.trim().split("\\s+");
                for (int i = 0; i < parts.length; i++) {
                    result.get(i).add(parts[i]);
                }
            }
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

}

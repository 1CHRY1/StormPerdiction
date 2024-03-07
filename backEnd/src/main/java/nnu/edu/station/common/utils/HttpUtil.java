package nnu.edu.station.common.utils;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.util.EntityUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @projectName: backEnd
 * @package:
 * @className: HttpUtil
 * @author: Chry
 * @description: TODO
 * @date: 2024/2/27 9:13
 * @version: 1.0
 */
public class HttpUtil {

    public static String encodeChineseURL(String url) {
        try {
            // 使用正则表达式匹配中文字符
            String regEx = "[\\u4e00-\\u9fa5]";
            Pattern pattern = Pattern.compile(regEx);
            Matcher matcher = pattern.matcher(url);
            StringBuffer sb = new StringBuffer();

            // 替换中文字符为编码后的字符
            while (matcher.find()) {
                String chineseChar = matcher.group(0);
                String encodedChar = URLEncoder.encode(chineseChar, "UTF-8");
                matcher.appendReplacement(sb, encodedChar);
            }
            matcher.appendTail(sb);

            // 将编码后的字符拼接回原始 URL 中的其它部分
            String encodedURL = sb.toString();
            return encodedURL;
        } catch (Exception e) {
            return url; // 返回原始 URL，表示编码失败
        }
    }

    public static JSONObject GetRealData(String url) {
        try {
            String encodedURL = encodeChineseURL(url);
            URL Url = new URL(encodedURL);
            HttpURLConnection connection = (HttpURLConnection) Url.openConnection();
            connection.setRequestMethod("GET");
            int responseCode = connection.getResponseCode();
            StringBuilder response = new StringBuilder();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
            } else {
                System.out.println("GET request failed with response code " + responseCode);
                return new JSONObject();
            }
            connection.disconnect();
            return JSONObject.parseObject(response.toString());
        } catch (Exception e) {
            System.out.println(e);
            return new JSONObject();
        }
    }
}

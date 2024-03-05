package nnu.edu.station.common.utils;

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
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;

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

    public static String sendGet(String url, String param) {
        // 暂时使用不了这个玩意
        StringBuilder result = new StringBuilder();
        BufferedReader in = null;
        try {
            String urlNameString = url + "?" + param;
            URL realUrl = new URL(urlNameString);
            URLConnection connection = realUrl.openConnection();
            connection.setRequestProperty("accept", "*/*");
            connection.setRequestProperty("connection", "Keep-Alive");
            connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            connection.connect();
            in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result.append(line);
            }
        } catch (ConnectException e) {
            //此处转成自己的日志记录
            System.out.println("调用HttpUtils.sendGet ConnectException, url=" + url + ",param=" + param);
        } catch (SocketTimeoutException e) {
            //此处转成自己的日志记录
            System.out.println("调用HttpUtils.sendGet SocketTimeoutException, url=" + url + ",param=" + param);
        } catch (IOException e) {
            //此处转成自己的日志记录
            System.out.println("调用HttpUtils.sendGet IOException, url=" + url + ",param=" + param);
        } catch (Exception e) {
            //此处转成自己的日志记录
            System.out.println("调用HttpsUtil.sendGet Exception, url=" + url + ",param=" + param);
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception ex) {
                //此处转成自己的日志记录
                System.out.println("调用in.close Exception, url=" + url + ",param=" + param);
            }
        }
        return result.toString();
    }
}

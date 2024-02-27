package nnu.edu.station.common.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public static String getResponseByUrl(String url) throws IOException {
        HttpURLConnection connection = null;
        BufferedReader reader = null;
        try {
            URL requestUrl = new URL(url);
            connection = (HttpURLConnection) requestUrl.openConnection();
            connection.setRequestMethod("GET");

            List<String> cookies = connection.getHeaderFields().get("Set-Cookie");
//            String cookie = String.join("; ", cookies);
            HttpURLConnection connection1 = (HttpURLConnection) requestUrl.openConnection();
            connection1.setRequestMethod("GET");
            connection1.setRequestProperty("Cookie", cookies.toString());

            cookies = connection.getHeaderFields().get("Set-Cookie");
//            cookie = String.join("; ", cookies);
            HttpURLConnection connection2 = (HttpURLConnection) requestUrl.openConnection();
            connection1.setRequestMethod("GET");
            connection1.setRequestProperty("Cookie", cookies.toString());

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                System.out.println(response.toString());
            } else {
                System.out.println("Error: " + responseCode);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                reader.close();
            }
            if (connection != null) {
                connection.disconnect();
            }
        }
        return "asdf";
    }
}

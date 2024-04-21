package nnu.edu.station.common.utils;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/3/5 14:35
 * @Description:
 */
public class UpdateUtil {
    public static void DataUpdating(String python, String updateData, String dataprocessPath, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 每日更新站点数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + updateData + " " + dataprocessPath);
            // 添加日志输出
            System.out.println("Data updating scheduled at " + LocalDateTime.now());
            writer.println("Log message: Data updating scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Data updating executed successfully!");
                writer.println("Log message: Data updating executed successfully!");
            } else {
                System.out.println("Data updating execution failed!");
                writer.println("Log message: Data updating execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing Data updating" + e.getMessage());
            writer.println("Log message: Error executing Data updating" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void ManuelDataUpdating(String python, String manuelUpdateData, String dataprocessPath, String folderPath, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 每日更新站点数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + manuelUpdateData + " " + dataprocessPath + " " + folderPath);
            // 添加日志输出
            System.out.println("Manuel Data updating scheduled at " + LocalDateTime.now());
            writer.println("Log message: Manuel Data updating scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Manuel Data updating executed successfully!");
                writer.println("Log message: Manuel Data updating executed successfully!");
            } else {
                System.out.println("Manuel Data updating execution failed!");
                writer.println("Log message: Manuel Data updating execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing Manuel Data updating" + e.getMessage());
            writer.println("Log message: Error executing Manuel Data updating" + e.getMessage());
        } finally {
            writer.close();
        }
    }
}

package nnu.edu.station.common.utils;

import org.springframework.beans.factory.annotation.Value;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/3/5 14:21
 * @Description:
 */
public class ClawingUtil {

    public static void ClawingCloudData(String python, String clawingCloud, String db, String cloudfile, String webdriver ,String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 爬取卫星云图数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + clawingCloud + " " + db + " " + cloudfile + " " + webdriver);
            // 添加日志输出
            System.out.println("Cloud Data clawing scheduled at " + LocalDateTime.now());
            writer.println("Log message: Cloud Data clawing scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Cloud Data clawing  executed successfully!");
                writer.println("Log message: Cloud Data clawing executed successfully!");
            } else {
                System.out.println("Cloud Data clawing execution failed!");
                writer.println("Log message: Cloud Data clawing execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing cloud Data clawing" + e.getMessage());
            writer.println("Log message: Error executing cloud Data clawing" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void ClawingRadarData(String python, String clawingRadar, String db, String radarfile, String webdriver, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 爬取雷达拼图数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + clawingRadar + " " + db + " " + radarfile + " " + webdriver);
            // 添加日志输出
            System.out.println("Radar Data clawing scheduled at " + LocalDateTime.now());
            writer.println("Log message: Radar Data clawing scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Radar Data clawing  executed successfully!");
                writer.println("Log message: Cloud Data clawing executed successfully!");
            } else {
                System.out.println("Radar Data clawing execution failed!");
                writer.println("Log message: Cloud Data clawing execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing radar Data clawing" + e.getMessage());
            writer.println("Log message: Error executing radar Data clawing" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void ClawingRainfallData(String python, String clawingRainfall, String db, String rainfallfile, String webdriver, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 爬取降水量实况数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + clawingRainfall + " " + db + " " + rainfallfile + " " + webdriver);
            // 添加日志输出
            System.out.println("Rainfall Data clawing scheduled at " + LocalDateTime.now());
            writer.println("Log message: Rainfall Data clawing scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Rainfall Data clawing  executed successfully!");
                writer.println("Log message: Rainfall Data clawing executed successfully!");
            } else {
                System.out.println("Rainfall Data clawing execution failed!");
                writer.println("Log message: Rainfall Data clawing execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing rainfall Data clawing" + e.getMessage());
            writer.println("Log message: Error executing rainfall Data clawing" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void ClawingRainfallpreData(String python, String clawingRainfallpre, String db, String rainfallprefile, String webdriver, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 爬取降水量实况数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + clawingRainfallpre + " " + db + " " + rainfallprefile + " " + webdriver);
            // 添加日志输出
            System.out.println("Rainfallpre Data clawing scheduled at " + LocalDateTime.now());
            writer.println("Log message: Rainfallpre Data clawing scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Rainfallpre Data clawing  executed successfully!");
                writer.println("Log message: Rainfallpre Data clawing executed successfully!");
            } else {
                System.out.println("Rainfallpre Data clawing execution failed!");
                writer.println("Log message: Rainfallpre Data clawing execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing rainfallpre Data clawing" + e.getMessage());
            writer.println("Log message: Error executing rainfallpre Data clawing" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void DeleteClawingData(String python, String clawingCloud, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 爬取降水量实况数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + clawingCloud);
            // 添加日志输出
            System.out.println("Clawed data deleting scheduled at " + LocalDateTime.now());
            writer.println("Log message: Clawed data deleting scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Clawed data deleting executed successfully!");
                writer.println("Log message: Clawed data deleting executed successfully!");
            } else {
                System.out.println("Clawed data deleting execution failed!");
                writer.println("Log message: Clawed data deleting execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing deleting clawed data" + e.getMessage());
            writer.println("Log message: Error executing deleting clawed data" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void ClawingTyphoonData(String python, String clawingTyphoon, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        //爬取台风数据
        try {
            Process process = Runtime.getRuntime().exec(python + " " + clawingTyphoon);
            // 添加日志输出
            System.out.println("Typhoon Data clawing scheduled at " + LocalDateTime.now());
            writer.println("Log message: Typhoon Data clawing scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Typhoon Data clawing executed successfully!");
                writer.println("Log message: Typhoon Data clawing executed successfully!");
            } else {
                System.out.println("Typhoon Data clawing execution failed!");
                writer.println("Log message: Typhoon Data clawing execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing clawing Typhoon Data" + e.getMessage());
            writer.println("Log message: Error executing clawing Typhoon Data" + e.getMessage());
        } finally {
            writer.close();
        }
    }
}

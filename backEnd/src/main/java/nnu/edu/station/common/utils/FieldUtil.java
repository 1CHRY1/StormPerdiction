package nnu.edu.station.common.utils;

import lombok.extern.slf4j.Slf4j;
import nnu.edu.station.dao.level.LevelMapper;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * @projectName: backEnd
 * @package:
 * @className: FieldUtil
 * @author: Chry
 * @description: TODO
 * @date: 2024/2/29 15:22
 * @version: 1.0
 */

@Slf4j
public class FieldUtil {

    public static void executePythonTxtBuilder4flow(String python, String logPath, String txtBuilder4flow, String ncfilepath) {
        // 执行流场txt生成
        try {
            Runtime.getRuntime().exec(python + " " + txtBuilder4flow + " " + ncfilepath);
            // 添加日志输出
            log.info("TxtBuilder4flow executed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: TxtBuilder4flow executed successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("TxtBuilder4flow executed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void executePythonTxtBuilder4wind(String python, String logPath, String txtBuilder4wind, String ncfilepath) {
        // 执行风场txt生成
        try {
            Runtime.getRuntime().exec(python + " " + txtBuilder4wind + " " + ncfilepath);
            // 添加日志输出
            log.info("TxtBuilder4wind executed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: TxtBuilder4wind executed successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("TxtBuilder4wind executed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void executePythonTxtBuilder4add(String python, String logPath, String txtBuilder4zeta, String ncfilepath_fort, String ncfilepath2_acdirc) {
        // 执行增水场txt生成
        try {
            Runtime.getRuntime().exec(python + " " + txtBuilder4zeta + " " + ncfilepath_fort + " " + ncfilepath2_acdirc);
            // 添加日志输出
            log.info("TxtBuilder4zeta executed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: TxtBuilder4zeta executed successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("TxtBuilder4zeta executed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void executePythonTriangle(String python, String logPath, String triangle) {
        // 执行增水场txt生成
        try {
            Runtime.getRuntime().exec(python + " " + triangle);
            // 添加日志输出
            log.info("Triangle executed successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Triangle executed successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Triangle executed successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void executePythonDeleteFieldData(String python, String logPath, String DeleteFileData) {
        // 执行场数据删除
        try {
            Runtime.getRuntime().exec(python + " " + DeleteFileData);
            // 添加日志输出
            log.info("Field data deleted successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Field data deleted successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Field data deleted successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void executeCppFlowField(String exe, String inputPath, String outputPath, String logPath) {
        // 执行流场纹理数据生成
        try {
            Runtime.getRuntime().exec(exe + " " + inputPath + " " + outputPath);
            // 添加日志输出
            log.info("Flow field data generated successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Flow field data generated successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Flow field data generated successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public static void executeCppWindField(String exe, String inputPath, String outputPath, String logPath) {
        // 执行风场纹理数据生成
        try {
            Runtime.getRuntime().exec(exe + " " + inputPath + " " + outputPath);
            // 添加日志输出
            log.info("Wind field data generated successfully! Python script execution scheduled at: {}", LocalDateTime.now());
            // 创建日志文件
            try (PrintWriter writer = new PrintWriter(new FileWriter(logPath, true))) {
                writer.println("Log message: Wind field data generated successfully! Python script execution scheduled at " + LocalDateTime.now());
            }
            System.out.println("Wind field data generated successfully!");
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}

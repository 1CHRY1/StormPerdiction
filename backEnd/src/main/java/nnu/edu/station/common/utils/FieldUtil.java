package nnu.edu.station.common.utils;

import lombok.extern.slf4j.Slf4j;
import nnu.edu.station.dao.level.LevelMapper;
import nnu.edu.station.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.io.FileWriter;
import java.io.IOException;
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

    public static void executePythonDeleteFieldData(String python, String logPath, String DeleteFileData) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 执行场数据删除
        try {
            Process process = Runtime.getRuntime().exec(python + " " + DeleteFileData);
            // 添加日志输出
            System.out.println("File data deleted scheduled at " + LocalDateTime.now());
            writer.println("Log message: File data deleted scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("File data deleted executed successfully!");
                writer.println("Log message: file data deleted executed successfully!");
            } else {
                System.out.println("File data deleted execution failed!");
                writer.println("Log message: File data deleted execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing file data deleted" + e.getMessage());
            writer.println("Log message: Error executing file data deleted" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static Integer executePythonTxtBuilder4flow(String python, String logPath, String txtBuilder4flow, String ncfilepath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 执行流场txt生成
        try {
            Process process = Runtime.getRuntime().exec(python + " " + txtBuilder4flow + " " + ncfilepath);
            // 添加日志输出
            System.out.println("TxtBuilder4flow scheduled at " + LocalDateTime.now());
            writer.println("Log message: TxtBuilder4flow scheduled at " + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("TxtBuilder4flow executed successfully!");
                writer.println("Log message: TxtBuilder4flow executed successfully!");
                return 0;
            } else {
                System.out.println("TxtBuilder4flow execution failed!");
                writer.println("Log message: TxtBuilder4flow execution failed!");
                return exitCode;
            }
        } catch (Exception e) {
            System.out.println("Error executing TxtBuilder4flow" + e.getMessage());
            writer.println("Log message: Error executing TxtBuilder4flow" + e.getMessage());
            return -1;
        } finally {
            writer.close();
        }
    }

    public static Integer executePythonTxtBuilder4wind(String python, String logPath, String txtBuilder4wind, String ncfilepath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 执行风场txt生成
        try {
            Process process = Runtime.getRuntime().exec(python + " " + txtBuilder4wind + " " + ncfilepath);
            // 添加日志输出
            writer.println("TxtBuilder4wind execution scheduled at: {}" + LocalDateTime.now());
            System.out.println("Log message: TxtBuilder4wind execution scheduled at: {}" + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("TxtBuilder4wind executed successfully!");
                writer.println("Log message: TxtBuilder4wind executed successfully!");
                return 0;
            } else {
                System.out.println("TxtBuilder4wind execution failed!");
                writer.println("Log message: TxtBuilder4wind execution failed!");
                return exitCode;
            }
        } catch (Exception e) {
            System.out.println("Error executing TxtBuilder4wind" + e.getMessage());
            writer.println("Log message: Error executing TxtBuilder4wind" + e.getMessage());
            return -1;
        } finally {
            writer.close();
        }
    }

    public static Integer executePythonTxtBuilder4add(String python, String logPath, String txtBuilder4zeta, String ncfilepath_fort, String ncfilepath2_acdirc) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 执行增水场txt生成
        try {
            Process process = Runtime.getRuntime().exec(python + " " + txtBuilder4zeta + " " + ncfilepath_fort + " " + ncfilepath2_acdirc);
            // 添加日志输出
            writer.println("TxtBuilder4zeta execution scheduled at: {}" + LocalDateTime.now());
            System.out.println("Log message: TxtBuilder4zeta execution scheduled at: {}" + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("TxtBuilder4zeta executed successfully!");
                writer.println("Log message: TxtBuilder4zeta executed successfully!");
                return 0;
            } else {
                System.out.println("TxtBuilder4zeta execution failed!");
                writer.println("Log message: TxtBuilder4zeta execution failed!");
                return exitCode;
            }
        } catch (Exception e) {
            System.out.println("Error executing TxtBuilder4zeta" + e.getMessage());
            writer.println("Log message: Error executing TxtBuilder4zeta" + e.getMessage());
            return -1;
        } finally {
            writer.close();
        }
    }

    public static void executePythonTriangle(String python, String logPath, String triangle, String outputPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 执行增水场json生成
        try {
            Process process = Runtime.getRuntime().exec(python + " " + triangle + " " + outputPath);
            // 添加日志输出
            writer.println("Triangle execution scheduled at: {}" + LocalDateTime.now());
            System.out.println("Log message: Triangle execution scheduled at: {}" + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Triangle executed successfully!");
                writer.println("Log message: Triangle executed successfully!");
            } else {
                System.out.println("Triangle execution failed!");
                writer.println("Log message: Triangle execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing Triangle" + e.getMessage());
            writer.println("Log message: Error executing Triangle" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void executeCppFlowField(String exe, String inputJsonPath, String inputPath, String outputPath, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 执行流场纹理数据生成
        try {
            Process process = Runtime.getRuntime().exec(exe + " " + inputJsonPath + " " + inputPath + " " + outputPath);
            // 添加日志输出
            writer.println("Flow field data generation execution scheduled at: {}" + LocalDateTime.now());
            System.out.println("Log message: Flow field data generation execution scheduled at: {}" + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Flow field data generation executed successfully!");
                writer.println("Log message: Flow field data generation executed successfully!");
            } else {
                System.out.println("Flow field data generation execution failed!");
                writer.println("Log message: Flow field data generation execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing flow field data generation" + e.getMessage());
            writer.println("Log message: Error executing flow field data generation" + e.getMessage());
        } finally {
            writer.close();
        }
    }

    public static void executeCppWindField(String exe, String inputJsonPath, String inputPath, String outputPath, String logPath) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 执行风场纹理数据生成
        try {
            Process process = Runtime.getRuntime().exec(exe + " " + inputJsonPath + " " + inputPath + " " + outputPath);
            // 添加日志输出
            writer.println("Wind field data generation execution scheduled at: {}" + LocalDateTime.now());
            System.out.println("Log message: Wind field data generation execution scheduled at: {}" + LocalDateTime.now());
            // 等待脚本完成
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Wind field data generation executed successfully!");
                writer.println("Log message: Wind field data generation executed successfully!");
            } else {
                System.out.println("Wind field data generation execution failed!");
                writer.println("Log message: Wind field data generation execution failed!");
            }
        } catch (Exception e) {
            System.out.println("Error executing wind field data generation" + e.getMessage());
            writer.println("Log message: Error executing wind field data generation" + e.getMessage());
        } finally {
            writer.close();
        }
    }
}

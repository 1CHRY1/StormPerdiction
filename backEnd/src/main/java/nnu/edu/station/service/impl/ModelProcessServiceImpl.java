package nnu.edu.station.service.impl;

import nnu.edu.station.common.utils.UpdateUtil;
import nnu.edu.station.service.ModelProcessService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/4/20 15:56
 * @Description:
 */

@Service
public class ModelProcessServiceImpl implements ModelProcessService {

    @Value("${DirectoryPath}")
    String directoryPath;

    @Value("${ScriptName}")
    String scriptName;

    @Value("${ForecastDataPath}")
    String forecastDataPath;

    @Value("${python}")
    String python;

    @Value("${ManuelUpdating}")
    String manuelUpdating;

    @Value("${dataprocess}")
    String dataprocess;

    @Value("${DataProcessLog}")
    String logPath;

    @Override
    public String run() throws IOException, InterruptedException {
        // 执行模型操作
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 判断系统类型
        String osName = System.getProperty("os.name").toLowerCase();
        if ( osName.contains("windows") ) {
            Set<Path> beforeOperation = ScanFolder();
            String cmd = "cmd.exe /c ";
            String command = cmd + directoryPath + File.separator + scriptName;
            Process process = Runtime.getRuntime().exec(command);
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                writer.println("Log message: Shell script executed successfully at " + LocalDateTime.now());
                System.out.println("Shell script executed successfully.");
            } else {
                writer.println("Log message: Shell script executed failed at " + LocalDateTime.now());
                System.out.println("Shell script execution failed.");
            }
            Set<Path> afterOperation = ScanFolder();
            Set<Path> newFolders = new HashSet<>(afterOperation);
            newFolders.removeAll(beforeOperation);
            String folderName = newFolders.iterator().next().toString();
            UpdateUtil.ManuelDataUpdating(python, manuelUpdating, dataprocess, folderName, logPath);

        } else if (osName.contains("linux")) {
            Set<Path> beforeOperation = ScanFolder();
            String sh = "sh ";
            String command = sh + directoryPath + File.separator + scriptName;
            Process process = Runtime.getRuntime().exec(command);
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                writer.println("Log message: Shell script executed successfully at " + LocalDateTime.now());
                System.out.println("Shell script executed successfully.");
            } else {
                writer.println("Log message: Shell script executed failed at " + LocalDateTime.now());
                System.out.println("Shell script execution failed.");
            }
            Set<Path> afterOperation = ScanFolder();
            Set<Path> newFolders = new HashSet<>(afterOperation);
            newFolders.removeAll(beforeOperation);
            String folderName = newFolders.iterator().next().toString();
            UpdateUtil.ManuelDataUpdating(python, manuelUpdating, dataprocess, folderName, logPath);
        }
        String finishTime = LocalDateTime.now().toString();
        return "模型于"+ finishTime +"运行完毕";
    }

    private Set<Path> ScanFolder() {
        // 扫描文件夹，获取新文件
        Set<Path> folderContent = new HashSet<>();
        Path dir = Paths.get(forecastDataPath);
        if (Files.isDirectory(dir)) {
            try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir)) {
                for (Path file : stream) {
                    folderContent.add(file);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return folderContent;
    }
}

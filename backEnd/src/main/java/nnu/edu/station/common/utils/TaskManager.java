package nnu.edu.station.common.utils;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/5/6 16:44
 * @Description:
 */
public class TaskManager {

    private ScheduledExecutorService executorService;
    private ScheduledFuture<?> scheduledFuture;
    private Boolean isRunningOnce = false;
    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    public TaskManager() {
        this.executorService = Executors.newSingleThreadScheduledExecutor();
    }

    private void runOnceTask(String logPath, String directoryPath, String scriptName, String python, String manuelUpdating, String dataprocess, String forecastDataPath) throws IOException, InterruptedException {
        // 执行模型操作
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        // 判断系统类型
        String osName = System.getProperty("os.name").toLowerCase();
        isRunningOnce = true;
        if ( osName.contains("windows") ) {
            Set<Path> beforeOperation = scanFolder(forecastDataPath);
            String cmd = "cmd.exe /c ";
            String command = cmd + directoryPath + File.separator + scriptName;
            Process process = Runtime.getRuntime().exec(command);
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                writer.println("Log message: Shell script executed successfully at " + LocalDateTime.now());
                System.out.println("Shell script executed successfully.");
                writer.close();
            } else {
                writer.println("Log message: Shell script executed failed at " + LocalDateTime.now());
                System.out.println("Shell script execution failed.");
                writer.close();
            }
            Set<Path> afterOperation = scanFolder(forecastDataPath);
            Set<Path> newFolders = new HashSet<>(afterOperation);
            newFolders.removeAll(beforeOperation);
            if (newFolders.toArray().length == 0) {
                isRunningOnce = false;
                return;
            } else {
                String folderName = newFolders.iterator().next().toString();
                UpdateUtil.ManuelDataUpdating(python, manuelUpdating, dataprocess, folderName, logPath);
            }
        } else if (osName.contains("linux")) {
            Set<Path> beforeOperation = scanFolder(forecastDataPath);
            String sh = "sh ";
            String command = sh + directoryPath + File.separator + scriptName;
            Process process = Runtime.getRuntime().exec(command);
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                writer.println("Log message: Shell script executed successfully at " + LocalDateTime.now());
                System.out.println("Shell script executed successfully.");
                writer.close();
            } else {
                writer.println("Log message: Shell script executed failed at " + LocalDateTime.now());
                System.out.println("Shell script execution failed.");
                writer.close();
            }
            Set<Path> afterOperation = scanFolder(forecastDataPath);
            Set<Path> newFolders = new HashSet<>(afterOperation);
            newFolders.removeAll(beforeOperation);
            if (newFolders.toArray().length == 0) {
                isRunningOnce = false;
                return;
            } else {
                String folderName = newFolders.iterator().next().toString();
                UpdateUtil.ManuelDataUpdating(python, manuelUpdating, dataprocess, folderName, logPath);
            }
        }
        isRunningOnce = false;
        return;
    }

    public String runOnceCondition() {
        if (isRunningOnce) {
            return "单次任务执行中！";
        } else {
            return "未在执行单次任务！";
        }
    }

    public String runOnce(String logPath, String directoryPath, String scriptName, String python, String manuelUpdating, String dataprocess, String forecastDataPath) {
        Callable<String> task = () -> {
            try {
                runOnceTask(logPath, directoryPath, scriptName, python, manuelUpdating, dataprocess, forecastDataPath);
            } catch (IOException | InterruptedException e) {
                System.out.println(e);
                return "执行任务过程中发生错误 " + e;
            }
            return null;
        };
        executorService.submit(task);
        // 提交任务并返回Future对象
        return "任务于" + LocalDateTime.now().toString() + "开始执行";
    }

    @SneakyThrows
    public synchronized String runRegular(String logPath, String directoryPath, String scriptName, String python, String manuelUpdating, String dataprocess, String forecastDataPath) {
        // 每隔三小时执行任务
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        writer.println("Log message: Emergency task executed at " + LocalDateTime.now());
        System.out.println("Log message: Emergency task executed at " + LocalDateTime.now());
        writer.close();
        Runnable task = () -> {
            if (isRunning.get()) {
                try {
                    runOnce(logPath, directoryPath, scriptName, python, manuelUpdating, dataprocess, forecastDataPath);
                } catch (Exception e) {
                    System.out.println(e);
                }
            }
        };
        // 三天后自动停止任务
        Runnable stoptask = () -> {
            stopRunRegular(logPath);
        };
        // 任务执行
        executorService = Executors.newSingleThreadScheduledExecutor();
        isRunning.set(true);
        scheduledFuture = executorService.scheduleAtFixedRate(task, 0, 5, TimeUnit.SECONDS);
        scheduledFuture = executorService.scheduleAtFixedRate(stoptask, 12, 12, TimeUnit.SECONDS);

        return "紧急任务已启动！";
    }

    public String runRegularCondition() {
        if (isRunning.get()) {
            return "紧急定时任务执行中！";
        } else {
            return "未执在行紧急定时任务！";
        }
    }

    @SneakyThrows
    public synchronized String stopRunRegular(String logPath) {
        PrintWriter writer = new PrintWriter(new FileWriter(logPath, true));
        writer.println("Log message: Emergency task stopped at " + LocalDateTime.now());
        System.out.println("Log message: Emergency task stopped at " + LocalDateTime.now());
        writer.close();
        isRunning.set(false);
        if (scheduledFuture != null && !scheduledFuture.isCancelled()) {
            scheduledFuture.cancel(false);
        }
        executorService.shutdown();
        return "紧急任务已暂停！";
    }

    private Set<Path> scanFolder(String forecastDataPath) {
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
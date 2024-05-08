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
import java.util.List;
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
    private Boolean isRunningOnce1 = false;
    private Boolean isRunningOnce2 = false;
    private LocalDateTime isRunningOnceTaskTime = null;
    private final AtomicBoolean isRunning = new AtomicBoolean(false);
    private LocalDateTime isRunningRegularTaskTime = null;

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
            isRunningOnce = true;
            Process process = Runtime.getRuntime().exec(command);
            boolean exitCode = process.waitFor(60,TimeUnit.MINUTES);
            if (exitCode) {
                writer.println("Log message: Shell script1 executed successfully at " + LocalDateTime.now());
                System.out.println("Shell script1 executed successfully.");
                writer.close();
            } else {
                writer.println("Log message: Shell script1 executed failed at " + LocalDateTime.now());
                System.out.println("Shell script1 execution failed.");
                writer.close();
            }
            isRunningOnce = false;
            Set<Path> afterOperation = scanFolder(forecastDataPath);
            Set<Path> newFolders = new HashSet<>(afterOperation);
            newFolders.removeAll(beforeOperation);
            if (newFolders.toArray().length == 0) {
                isRunningOnce = false;
                return;
            } else {
                for (Object obj : newFolders.toArray()) {
                    String folderName = obj.toString();
                    if ( new File(folderName).getName().length() > 8) {
                        UpdateUtil.ManuelDataUpdating(python, manuelUpdating, dataprocess, folderName, logPath);
                    }
                }
            }
        } else if (osName.contains("linux")) {
            Set<Path> beforeOperation = scanFolder(forecastDataPath);
            String sh = "sh ";
            String command = sh + directoryPath + File.separator + scriptName;
            isRunningOnce = true;
            Process process = Runtime.getRuntime().exec(command);
            boolean exitCode = process.waitFor(60,TimeUnit.MINUTES);
            if (exitCode) {
                writer.println("Log message: Shell script1 executed successfully at " + LocalDateTime.now());
                System.out.println("Shell script1 executed successfully.");
                writer.close();
            } else {
                writer.println("Log message: Shell script1 executed failed at " + LocalDateTime.now());
                System.out.println("Shell script1 execution failed.");
                writer.close();
            }
            isRunningOnce = false;
            Set<Path> afterOperation = scanFolder(forecastDataPath);
            Set<Path> newFolders = new HashSet<>(afterOperation);
            newFolders.removeAll(beforeOperation);
            if (newFolders.toArray().length == 0) {
                isRunningOnce = false;
                return;
            } else {
                for (Object obj : newFolders.toArray()) {
                    String folderName = obj.toString();
                    if ( new File(folderName).getName().length() > 8) {
                        UpdateUtil.ManuelDataUpdating(python, manuelUpdating, dataprocess, folderName, logPath);
                    }
                }
            }
        }
        isRunningOnce = false;
        isRunningOnceTaskTime = null;
        return;
    }

    public String runOnceCondition() {
        if (!isRunningOnce) {
            return "未在执行单次任务！";
        } else {
            if (isRunningOnce1) {
                return "单次任务执行中! 任务开始时间为：" + isRunningOnceTaskTime.toString() + " 。当前执行数据下载操作";
            } else if (isRunningOnce2) {
                return "单次任务执行中! 任务开始时间为：" + isRunningOnceTaskTime.toString() + " 。当前执行数据计算操作";
            } else {
                return "单次任务执行中! 任务开始时间为：";
            }
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
        isRunningOnceTaskTime = LocalDateTime.now();
        // 提交任务并返回Future对象
        return "任务于" + isRunningOnceTaskTime + "开始执行";
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
        isRunningRegularTaskTime = LocalDateTime.now();
        scheduledFuture = executorService.scheduleAtFixedRate(task, 0, 3, TimeUnit.HOURS);
        scheduledFuture = executorService.scheduleAtFixedRate(stoptask, 3, 3, TimeUnit.DAYS);

        return "紧急任务已启动！紧急任务于" + isRunningRegularTaskTime.toString() + "开始执行";
    }

    public String runRegularCondition() {
        if (isRunning.get()) {
            return "紧急定时任务执行中！紧急任务开始时间为：" + isRunningRegularTaskTime.toString();
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
        isRunningRegularTaskTime = null;
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
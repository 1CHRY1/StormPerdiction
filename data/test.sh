#!/bin/bash
directory_path="D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/forecastData"
new_folder_name="test"

# 创建一个新的文件夹
mkdir -p "$directory_path/$new_folder_name"

# 等待两秒
sleep 2

# 删除刚才创建的文件夹
rm -rf "$directory_path/$new_folder_name"
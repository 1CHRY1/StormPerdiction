import os

def delete_all_files(folder_path):
    # 遍历指定文件夹及其子文件夹下的所有文件
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            file_path = os.path.join(root, file)
            os.remove(file_path)

folder_path = os.getcwd() + '/output'
delete_all_files(folder_path)
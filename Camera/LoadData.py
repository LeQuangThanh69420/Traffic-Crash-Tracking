import torch

def GetClasses():
    classes = {}
    with open('./Camera/data/classes.txt', 'r') as file:
        for line in file:
            if line.strip():
                class_name, color_code = line.split()
                color_tuple = tuple(map(int, color_code.split(',')))
                classes[class_name] = color_tuple

    return classes

def GetDevice():
    return "cuda" if torch.cuda.is_available() else "cpu"

def GetModel(level: int):
    models = [
        './Camera/yolov8n.pt',
        './Camera/yolov8s.pt',
        './Camera/yolov8m.pt',
        './Camera/yolov8l.pt',
        './Camera/yolov8x.pt'
    ]
    if 1 <= level <= 5:
        return models[level - 1]
    else:
        return "Invalid level"
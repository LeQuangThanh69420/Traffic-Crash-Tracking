import math

def IOU(box1, box2):
    x1_inter = max(box1[0], box2[0])
    y1_inter = max(box1[1], box2[1])
    x2_inter = min(box1[2], box2[2])
    y2_inter = min(box1[3], box2[3])
    # Diện tích mỗi box
    area_box1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area_box2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    # Kiểm tra mức chênh lệch diện tích
    min_area = min(area_box1, area_box2)
    max_area = max(area_box1, area_box2)
    if min_area < 0.7 * max_area:
        return 0
    # Diện tích phần giao
    inter_width = max(0, x2_inter - x1_inter)
    inter_height = max(0, y2_inter - y1_inter)
    intersection = inter_width * inter_height
    # Diện tích hợp
    union = area_box1 + area_box2 - intersection
    # Tính IoU
    if union == 0:
        return 0
    return intersection / union

def calculate_angle(prebox1, curbox1, prebox2, curbox2):
    A = ((prebox1[0] + prebox1[2]) // 2, (prebox1[1] + prebox1[3]) // 2)
    B = ((curbox1[0] + curbox1[2]) // 2, (curbox1[1] + curbox1[3]) // 2)
    C = ((prebox2[0] + prebox2[2]) // 2, (prebox2[1] + prebox2[3]) // 2)
    D = ((curbox2[0] + curbox2[2]) // 2, (curbox2[1] + curbox2[3]) // 2)
    # Tính tọa độ của 2 vectơ
    AB = (B[0] - A[0], B[1] - A[1])
    CD = (D[0] - C[0], D[1] - C[1])
    # Tích vô hướng
    dot_product = AB[0] * CD[0] + AB[1] * CD[1]
    # Độ dài của các vectơ
    magnitude_AB = math.sqrt(AB[0]**2 + AB[1]**2)
    magnitude_CD = math.sqrt(CD[0]**2 + CD[1]**2)
    if magnitude_AB == 0 or magnitude_CD == 0:
        return 0
    # Tính cos(theta)    
    cos_theta = dot_product / (magnitude_AB * magnitude_CD)
    # Giới hạn cos_theta trong khoảng [-1, 1] để tránh lỗi tính toán do làm tròn
    cos_theta = max(-1, min(1, cos_theta))
    # Tính góc bằng radian
    angle_rad = math.acos(cos_theta)
    # Đổi radian sang độ (nếu cần)
    angle_deg = math.degrees(angle_rad)
    return angle_deg
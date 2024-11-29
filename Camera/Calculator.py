import math

vecto_zero_threshold = 3

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

def IntersectionPoint(A, B, C, D):
    x1, y1 = A
    x2, y2 = B
    x3, y3 = C
    x4, y4 = D
    # Tính hệ số của phương trình đường thẳng
    denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if denom == 0:
        return None
    # Tìm giao điểm
    px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom
    py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom
    return (int(px), int(py))

def Beetween(A, B, M):
    x1, y1 = A
    x2, y2 = B
    x3, y3 = M
    if (min(x1, x2) < x3 < max(x1, x2)):
        return True
    elif(min(y1, y2) < y3 < max(y1, y2)):
        return True
    else:
        return False

def VectoDotProduce(vecto_1, vecto_2):
    return vecto_1[0] * vecto_2[0] + vecto_1[1] * vecto_2[1]

def VectoMagnitude(vecto):
    return math.sqrt(vecto[0]**2 + vecto[1]**2)

def VectoAngle(dot_product, magnitude_1, magnitude_2):
    cos_theta = dot_product / (magnitude_1 * magnitude_2)
    cos_theta = max(-1, min(1, cos_theta))
    angle_rad = math.acos(cos_theta)
    angle_deg = math.degrees(angle_rad)
    return angle_deg

def VectoChecker(box_A, box_B, box_C, box_D):
    A = ((box_A[0] + box_A[2]) // 2, (box_A[1] + box_A[3]) // 2)
    B = ((box_B[0] + box_B[2]) // 2, (box_B[1] + box_B[3]) // 2)
    C = ((box_C[0] + box_C[2]) // 2, (box_C[1] + box_C[3]) // 2)
    D = ((box_D[0] + box_D[2]) // 2, (box_D[1] + box_D[3]) // 2)
    AB = (B[0] - A[0], B[1] - A[1])
    CD = (D[0] - C[0], D[1] - C[1])
    magnitude_AB = VectoMagnitude(AB)
    magnitude_CD = VectoMagnitude(CD)

    if magnitude_AB <= vecto_zero_threshold and magnitude_CD <= vecto_zero_threshold:
        return (False, 0, "")

    if magnitude_AB > vecto_zero_threshold and magnitude_CD > vecto_zero_threshold:
        dot_product = VectoDotProduce(AB, CD)
        angle_deg = VectoAngle(dot_product, magnitude_AB, magnitude_CD)
        if angle_deg > 30 and angle_deg < 150:
            E = IntersectionPoint(A, B, C, D)
            if Beetween(A=E, B=B, M=A) and Beetween(A=E, B=D, M=C):
                return (False, 0, "")
            return (True, angle_deg, "th1")
        else:
            return (False, 0, "")

    if magnitude_AB > vecto_zero_threshold and magnitude_CD <= vecto_zero_threshold:
        AC = (C[0] - A[0], C[1] - A[1])
        magnitude_AC = VectoMagnitude(AC)
        if magnitude_AC <= vecto_zero_threshold:
            return (False, 0, "")
        else:
            dot_product = VectoDotProduce(AB, AC)
            angle_deg = VectoAngle(dot_product, magnitude_AB, magnitude_AC)
            if angle_deg < 20:
                return (True, angle_deg, "th0")
            else:
                return (False, 0, "")
        
    if magnitude_AB <= vecto_zero_threshold and magnitude_CD > vecto_zero_threshold:
        CA = (A[0] - C[0], A[1] - C[1])
        magnitude_CA = VectoMagnitude(CA)
        if magnitude_CA <= vecto_zero_threshold:
            return (False, 0, "")
        else:
            dot_product = VectoDotProduce(CA, CD)
            angle_deg = VectoAngle(dot_product, magnitude_CA, magnitude_CD)
            if angle_deg < 20:
                return (True, angle_deg, "th0")
            else:
                return (False, 0, "")
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
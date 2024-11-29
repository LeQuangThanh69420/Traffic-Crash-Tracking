import Calculator

def Movement(box_A, box_B):
    scale = 5
    x_A = (box_A[0] + box_A[2])//2
    y_A = (box_A[1] + box_A[3])//2
    x_B = (box_B[0] + box_B[2])//2
    y_B = (box_B[1] + box_B[3])//2
    velocity = Calculator.VectoMagnitude((x_B - x_A, y_B - y_A))
    if velocity <= Calculator.vecto_zero_threshold:
        return ((x_B, y_B), (x_B, y_B), 0)
    dx = x_B - x_A
    dy = y_B - y_A
    end_x = int(x_A + dx * scale)
    end_y = int(y_A + dy * scale)
    return ((x_B, y_B), (end_x, end_y), velocity)
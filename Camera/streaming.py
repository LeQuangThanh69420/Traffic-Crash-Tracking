import Connection
import LoadData
import Calculator

import time
import base64
import logging
import math

import cv2
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort

hub_connection = Connection.PresenceHubConnection()
hub_connection.start()
hub_connection.on_close(lambda: Connection.Exit)
hub_connection.on("ForcedDisconnect", Connection.Exit)

classes = LoadData.GetClasses()
model = YOLO(LoadData.GetModel(1)).to(LoadData.GetDevice())

capture = cv2.VideoCapture("./Camera/videos/cr.mp4")
width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))

tracker = DeepSort(max_age = 5)
tracks = []

checked_pairs = set()
previous_positions = {}

if not capture.isOpened():
    print("Cannot open")
    exit()

while True:
    ret, frame = capture.read()

    if not ret:
        capture.set(cv2.CAP_PROP_POS_FRAMES, 0)
        continue
        #break

    frame=cv2.resize(frame,(width,height))

    detect = []

    results = model.predict(frame, verbose=False)
    for result in results:
        boxes = result.boxes
        for box in boxes:
            class_id = int(box.cls[0])
            class_name = result.names[class_id]
            if class_name in classes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = box.conf[0]
                if confidence > 0.5:
                    detect.append([[x1, y1, x2 - x1, y2 - y1], confidence, (class_name, classes[class_name])])

    tracks = tracker.update_tracks(detect, frame=frame)
    current_tracks = {}
    previous_tracks = {}

    for track in tracks:
        track_id = track.track_id
        x1, y1, x2, y2 = map(int, track.to_ltrb())
        class_name, (R, G, B) = track.get_det_class()

        if track_id in previous_positions:
            previous_tracks[track_id] = previous_positions[track_id]
        else:
            previous_tracks[track_id] = (x1, y1, x2, y2)
        previous_positions[track_id] = (x1, y1, x2, y2)
        current_tracks[track_id] = (x1, y1, x2, y2)

        cv2.rectangle(frame, (x1, y1), (x2, y2), (B, G, R), 2)
        cv2.putText(frame, f'{track_id} {class_name}', (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (B, G, R), 2)

    for id1, box1 in current_tracks.items():
        for id2, box2 in current_tracks.items():
            if id1 >= id2:
                continue
            pair = (id1, id2)
            if pair in checked_pairs:
                continue
            iou = Calculator.IOU(box1, box2)
            if iou > 0.02 and iou < 0.4:
                print(f"Collision detected: {id1} and {id2}, IoU: {iou:.2f}")
                checked_pairs.add(pair)
    
    frame=cv2.resize(frame,(960,540))
    _, buffer = cv2.imencode('.jpg', frame)
    frame64 = base64.b64encode(buffer).decode('utf-8')
    hub_connection.send("SendFrame", [frame64])

    cv2.imshow('Camera', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

hub_connection.stop()
capture.release()
cv2.destroyAllWindows()
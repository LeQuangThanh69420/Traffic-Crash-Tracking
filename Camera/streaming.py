import Connection
import LoadData
import Calculator

import time
import base64
import logging

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

    detect  = []

    results = model.predict(frame, verbose=False)
    for result in results:
        boxes = result.boxes
        for box in boxes:
            class_id = int(box.cls[0])
            class_name = result.names[class_id]
            if class_name in classes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = box.conf[0]
                detect.append([[x1, y1, x2 - x1, y2 - y1], confidence, (class_name, classes[class_name])])

    tracks = tracker.update_tracks(detect, frame=frame)
    for track in tracks:
        track_id = track.track_id
        ltrb = track.to_ltrb()
        x1, y1, x2, y2 = map(int, ltrb)
        class_name, (R, G, B) = track.get_det_class()

        cv2.rectangle(frame, (x1, y1), (x2, y2), (B, G, R), 2)
        cv2.putText(frame, f'{track_id} {class_name}', (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (B, G, R), 2)
    
    frame=cv2.resize(frame,(640,360))
    _, buffer = cv2.imencode('.jpg', frame)
    frame64 = base64.b64encode(buffer).decode('utf-8')

    hub_connection.send("SendFrame", [frame64])

    cv2.imshow('Camera', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

hub_connection.stop()
capture.release()
cv2.destroyAllWindows()
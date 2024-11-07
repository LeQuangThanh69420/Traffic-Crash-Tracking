import time
import base64
import cv2
import logging
from signalrcore.hub_connection_builder import HubConnectionBuilder
import requests

cameraName = "Camera1"
apiUrl = "http://localhost:5195/api/"
hubUrl = "http://localhost:5195/hubs/"

def GetCameraToken():
    try:
        params = {
            'cameraName': cameraName
        }
        response = requests.get(f"{apiUrl}Camera/GetCameraToken", params=params)
        data = response.json()
        if response.status_code == 200:
            return data['token']
        elif response.status_code == 404:
            return data['message']
    except requests.exceptions.ConnectionError:
        print("Cannot connect")
        exit()
    except requests.exceptions.Timeout:
        print("Time out")
        exit()
    except requests.exceptions.RequestException as e:
        print(f"Exception: {e}")
        exit()

def PresenceHubConnection():
    return HubConnectionBuilder()\
    .with_url(hubUrl + "presence",
            options={
                "access_token_factory": GetCameraToken,
    })\
    .with_automatic_reconnect({
        "type": "raw",
        "keep_alive_interval": 10,
        "reconnect_interval": 5,
        "max_attempts": 5
    })\
    .build()
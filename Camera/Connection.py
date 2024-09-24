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
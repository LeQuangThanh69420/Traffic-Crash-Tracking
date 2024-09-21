USE TCT;
GO

INSERT INTO Camera (CameraName, Location, IsActive) VALUES ('Camera1', GEOGRAPHY::STPointFromText('POINT(105.804817 21.028511)', 4326), 1);
INSERT INTO Camera (CameraName, Location, IsActive) VALUES ('Camera2', GEOGRAPHY::STPointFromText('POINT(106.804817 22.028511)', 4326), 0);
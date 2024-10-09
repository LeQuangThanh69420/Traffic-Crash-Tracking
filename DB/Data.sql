USE TCT;
GO

INSERT INTO Station (StationName, Username, Password, Role, Address, Location, IsActive) VALUES (N'HUCE', N'adminadmin', N'HUCEadmin', 'Admin', N'Số 55 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Việt Nam', GEOGRAPHY::STPointFromText('POINT(105.8432406 21.003586)', 4326), 1);
INSERT INTO Station (StationName, Username, Password, Role, Address, Location, IsActive) VALUES (N'NhaHatLon', N'thenthen', N'nownownow', 'Member', N'Số 1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hà Nội, Việt Nam', GEOGRAPHY::STPointFromText('POINT(105.858303 21.024012)', 4326), 1);

INSERT INTO Camera (CameraName, Location, IsActive) VALUES ('Camera1', GEOGRAPHY::STPointFromText('POINT(105.841386 20.998176)', 4326), 1);
INSERT INTO Camera (CameraName, Location, IsActive) VALUES ('Camera2', GEOGRAPHY::STPointFromText('POINT(105.873420 21.001460)', 4326), 1);
INSERT INTO Camera (CameraName, Location, IsActive) VALUES ('Camera3', GEOGRAPHY::STPointFromText('POINT(105.855312 21.034488)', 4326), 0);
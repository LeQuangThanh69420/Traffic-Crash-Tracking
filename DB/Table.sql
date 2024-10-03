IF DB_ID('TCT') IS NOT NULL
BEGIN
    DROP DATABASE TCT;
END
GO

CREATE DATABASE TCT;
GO

USE TCT;
GO

CREATE TABLE Station (
    StationId BIGINT IDENTITY(1,1) PRIMARY KEY,
    StationName NVARCHAR(50) NOT NULL,
    Username varchar(16) NOT NULL CHECK (LEN(Username) >= 8) UNIQUE,
    Password varchar(16) NOT NULL CHECK (LEN(Password) >= 8),
    Role varchar(10) NOT NULL,
    Address NVARCHAR(100) NOT NULL,
    Location GEOGRAPHY NOT NULL,
    IsActive BIT NOT NULL,
);
GO

CREATE TABLE Camera (
    CameraId BIGINT IDENTITY(1,1) PRIMARY KEY,
    CameraName NVARCHAR(50) NOT NULL UNIQUE,
    Location GEOGRAPHY NOT NULL,
    IsActive BIT NOT NULL,
);
GO

CREATE TABLE Request (
    RequestId BIGINT IDENTITY(1,1) PRIMARY KEY,
    CameraId BIGINT NOT NULL FOREIGN KEY REFERENCES Camera(CameraId),
    StationId BIGINT NOT NULL FOREIGN KEY REFERENCES Station(StationId),
    CreatedDate DATETIME2(0) NOT NULL,
    Checked BIT,
    CheckedDate DATETIME2(0),
    Description varchar(300),
);
GO

CREATE TABLE Photo (
    PhotoId BIGINT IDENTITY(1,1) PRIMARY KEY,
    RequestId BIGINT NOT NULL FOREIGN KEY REFERENCES Request(RequestId),
    PhotoURL varchar(300) NOT NULL,
);
GO
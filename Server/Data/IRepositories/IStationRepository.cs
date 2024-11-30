using Server.Data.DTOs;
using Server.Data.Entities;

namespace Server.Data.IRepositories
{
    public interface IStationRepository
    {
        Task<bool> StationNameExists(string stationName);
        Task<bool> UsernameExists(string username);
        Task<Station?> GetStation(string username, string password);
        Task<Station?> GetStationByStationName(string name);
        Task<List<StationGetStationsOutputDTO>> GetStations();
        Task<bool> AddOrEdit(StationAddOrEditInputDTO input);
    }
}
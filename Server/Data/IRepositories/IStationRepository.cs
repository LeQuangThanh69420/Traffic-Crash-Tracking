using Server.Data.DTOs;
using Server.Data.Entities;

namespace Server.Data.IRepositories
{
    public interface IStationRepository
    {
        Task<Station?> GetStation(string username, string password);
        Task<List<StationGetStationsOutputDTO>> GetStations();
    }
}
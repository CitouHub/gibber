using AutoMapper;
using Gibbr.Data;
using Gibbr.Data.ComplexModel;

namespace Gibbr.Domain
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<BoardCell, BoardCellDTO>().ReverseMap();
            CreateMap<sp_getBoardCells_Result, BoardCellDTO>();
        }
    }
}

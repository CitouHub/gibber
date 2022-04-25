using AutoMapper;
using gibbr.Data;
using gibbr.Data.ComplexModel;

namespace gibbr.Domain
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

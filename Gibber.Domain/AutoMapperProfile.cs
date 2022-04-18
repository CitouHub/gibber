using AutoMapper;
using Gibber.Data;
using Gibber.Data.ComplexModel;

namespace Gibber.Domain
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

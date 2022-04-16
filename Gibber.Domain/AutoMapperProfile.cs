using AutoMapper;
using Gibber.Data;
using Gibber.Data.ComplexModel;

namespace Gibber.Domain
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<BoardCell, BoardCellDTO>()
                .ForMember(dest => dest.L, opt => opt.MapFrom(src => src.Letter))
                .ReverseMap()
                .ForMember(dest => dest.Letter, opt => opt.MapFrom(src => src.L));
            CreateMap<sp_getBoardCells_Result, BoardCellDTO>()
                .ForMember(dest => dest.L, opt => opt.MapFrom(src => src.Letter));
        }
    }
}

using AutoMapper;
using gibbr.Common;
using gibbr.Data;
using gibbr.Data.Extension;
using gibbr.Domain;

namespace gibbr.Service
{
    public interface IBoardService
    {
        Task<List<BoardCellDTO>> GetBoardCellsAsync(long x, long y, short dx, short dy);
        Task<bool> SetBoardCellAsync(BoardCellDTO boardCell);
    }

    public class BoardService : IBoardService
    {
        private readonly GibbrDbContext _context;
        private readonly IMapper _mapper;

        public BoardService(GibbrDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BoardCellDTO>> GetBoardCellsAsync(long x, long y, short dx, short dy)
        {
            var boardCells = await _context.sp_getBoardCellsAsync(x, y, dx, dy);

            return _mapper.Map<List<BoardCellDTO>>(boardCells);
        }

        public async Task<bool> SetBoardCellAsync(BoardCellDTO boardCellDto)
        {
            var boardCellState = (BoardCellState)await _context.sp_getBoardCellStateAsync(boardCellDto.X, boardCellDto.Y, boardCellDto.UserId);
            switch (boardCellState)
            {
                case BoardCellState.CanAdd:
                    return await _context.sp_addBoardCellAsync(boardCellDto.X, boardCellDto.Y, boardCellDto.UserId, boardCellDto.Letter);
                case BoardCellState.CanUpdate:
                    return await _context.sp_updateBoardCellAsync(boardCellDto.X, boardCellDto.Y, boardCellDto.Letter);
                default:
                    break;
            }

            return false;
        }
    }
}
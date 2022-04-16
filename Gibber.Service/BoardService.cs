using AutoMapper;
using Gibber.Data;
using Gibber.Data.Extension;
using Gibber.Domain;

namespace Gibbler.Service
{
    public interface IBoardService
    {
        Task<List<BoardCellDTO>> GetBoardCellsAsync(long x, long y, short dx, short dy);
        Task<bool> AddBoardCellAsync(BoardCellDTO boardCell);
    }

    public class BoardService : IBoardService
    {
        private readonly GibberDbContext _context;
        private readonly IMapper _mapper;

        public BoardService(GibberDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BoardCellDTO>> GetBoardCellsAsync(long x, long y, short dx, short dy)
        {
            var boardCells = await _context.sp_getBoardCells(x, y, dx, dy);

            return _mapper.Map<List<BoardCellDTO>>(boardCells);
        }

        public async Task<bool> AddBoardCellAsync(BoardCellDTO boardCellDto)
        {
            try
            {
                var boardCell = _mapper.Map<BoardCell>(boardCellDto);
                boardCell.InsertDate = DateTime.UtcNow;

                await _context.BoardCells.AddAsync(_mapper.Map<BoardCell>(boardCell));
                await _context.SaveChangesAsync();

                return true;
            } 
            catch
            {
                return false;
            }
        }
    }
}
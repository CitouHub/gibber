using Gibbr.API.Infrastructure;
using Gibbr.Domain;
using Gibbr.Service;
using Microsoft.AspNetCore.Mvc;

namespace Gibbr.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BoardController : ControllerBase
    {
        private readonly ILogger<BoardController> _logger;
        private readonly IBoardService _boardService;
        private readonly ISetBoardCellQueue _setBoardCellQueue;

        public BoardController(ILogger<BoardController> logger, IBoardService boardService, ISetBoardCellQueue setBoardCellQueue)
        {
            _logger = logger;
            _boardService = boardService;
            _setBoardCellQueue = setBoardCellQueue;
        }

        [HttpGet("cell/{x}/{y}/{dx}/{dy}")]
        public async Task<IActionResult> GetBoardCellsAsync(long x, long y, short dx, short dy)
        {
            try
            {
                if (dx > 0 && dy > 0)
                {
                    _logger.LogDebug($"Getting board cells for {y}:{y}:{dx}:{dy}");
                    var boardCells = await _boardService.GetBoardCellsAsync(x, y, dx, dy);

                    return Ok(boardCells);
                }
                else
                {
                    return BadRequest($"dx:{dy} and dy:{dy} must be greater then 0");
                }
            } catch(Exception ex)
            {
                return Ok(ex.ToString());
            }
            
        }

        [HttpPut("cell/{userId}")]
        public IActionResult AddBoardCells([FromBody] List<BoardCellDTO> boardCells, string userId)
        {
            _logger.LogDebug($"Request to queue {boardCells.Count} board cell for add");
            if (boardCells.Any())
            {
                foreach (var boardCell in boardCells)
                {
                    boardCell.UserId = userId;
                    _setBoardCellQueue.Enqueue(boardCell);
                    _logger.LogDebug($"Queued {boardCell} to be set for the board");
                }
            }

            return Ok();
        }
    }
}
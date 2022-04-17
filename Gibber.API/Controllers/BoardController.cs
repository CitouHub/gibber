using Gibber.API.Infrastructure;
using Gibber.Domain;
using Gibber.Service;
using Microsoft.AspNetCore.Mvc;

namespace Gibber.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BoardController : ControllerBase
    {
        private readonly ILogger<BoardController> _logger;
        private readonly IBoardService _boardService;
        private readonly IAddBoardCellQueue _addBoardCellQueue;

        public BoardController(ILogger<BoardController> logger, IBoardService boardService, IAddBoardCellQueue addBoardCellQueue)
        {
            _logger = logger;
            _boardService = boardService;
            _addBoardCellQueue = addBoardCellQueue;
        }

        [HttpGet("cell/{x}/{y}/{dx}/{dy}")]
        public async Task<IActionResult> GetBoardCellsAsync(long x, long y, short dx, short dy)
        {
            if(dx > 0 && dy > 0)
            {
                _logger.LogDebug($"Getting board cells for {y}:{y}:{dx}:{dy}");
                var boardCells = await _boardService.GetBoardCellsAsync(x, y, dx, dy);
                return Ok(boardCells);
            } 
            else
            {
                return BadRequest($"dx:{dy} and dy:{dy} must be greater then 0");
            }
        }

        [HttpPut("cell")]
        public IActionResult AddBoardCells(List<BoardCellDTO> boardCells)
        {
            if(boardCells.Any())
            {
                var remoteIpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                foreach (var boardCell in boardCells)
                {
                    boardCell.Source = remoteIpAddress ?? "Unknown";
                    _addBoardCellQueue.Enqueue(boardCell);
                    _logger.LogDebug($"Queued {boardCell} to be added to board");
                }

                return Ok();
            }
            else
            {
                return BadRequest($"List contains no elements");
            }
        }
    }
}
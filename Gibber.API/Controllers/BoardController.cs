using Gibber.API.Infrastructure;
using Gibber.Domain;
using Gibbler.Service;
using Microsoft.AspNetCore.Mvc;

namespace Gibbler.API.Controllers
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
        public async Task<List<BoardCellDTO>> GetBoardCellsAsync(long x, long y, short dx, short dy)
        {
            _logger.LogDebug($"Getting board cells for {y}:{y}:{dx}:{dy}");
            var boardCells = await _boardService.GetBoardCellsAsync(x, y, dx, dy);
            return boardCells;
        }

        [HttpPut("cell")]
        public void AddBoardCells(List<BoardCellDTO> boardCells)
        {
            var remoteIpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            foreach (var boardCell in boardCells)
            {
                boardCell.Source = remoteIpAddress ?? "Unknown";
                _addBoardCellQueue.Enqueue(boardCell);
                _logger.LogDebug($"Queued {boardCell} to be added to board");
            }
        }
    }
}
using Gibber.Domain;
using System.Collections.Concurrent;

namespace Gibber.API.Infrastructure
{
    public interface IAddBoardCellQueue
    {
        void Enqueue(BoardCellDTO boardCell);
        Task<BoardCellDTO?> DequeueAsync(CancellationToken cancellationToken);
    }

    public class AddBoardCellQueue : IAddBoardCellQueue
    {
        private readonly ILogger<AddBoardCellQueue> _logger;
        private readonly ConcurrentQueue<BoardCellDTO> _addBoardCellQueue;
        private readonly SemaphoreSlim _queueSignal;

        public AddBoardCellQueue(ILogger<AddBoardCellQueue> logger)
        {
            _logger = logger;
            _addBoardCellQueue = new ConcurrentQueue<BoardCellDTO>();
            _queueSignal = new SemaphoreSlim(0);
            _logger.LogDebug($"Instantiated");
        }

        public void Enqueue(BoardCellDTO boardCell)
        {
            _addBoardCellQueue.Enqueue(boardCell);
            _queueSignal.Release();
        }

        public async Task<BoardCellDTO?> DequeueAsync(CancellationToken cancellationToken)
        {
            await _queueSignal.WaitAsync(cancellationToken);
            _addBoardCellQueue.TryDequeue(out var boardCell);

            return boardCell;
        }
    }
}

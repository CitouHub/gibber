using Gibber.Domain;
using System.Collections.Concurrent;

namespace Gibber.API.Infrastructure
{
    public interface ISetBoardCellQueue
    {
        void Enqueue(BoardCellDTO boardCell);
        Task<BoardCellDTO?> DequeueAsync(CancellationToken cancellationToken);
    }

    public class SetBoardCellQueue : ISetBoardCellQueue
    {
        private readonly ILogger<SetBoardCellQueue> _logger;
        private readonly ConcurrentQueue<BoardCellDTO> _setBoardCellQueue;
        private readonly SemaphoreSlim _queueSignal;

        public SetBoardCellQueue(ILogger<SetBoardCellQueue> logger)
        {
            _logger = logger;
            _setBoardCellQueue = new ConcurrentQueue<BoardCellDTO>();
            _queueSignal = new SemaphoreSlim(0);
            _logger.LogDebug($"Instantiated");
        }

        public void Enqueue(BoardCellDTO boardCell)
        {
            _setBoardCellQueue.Enqueue(boardCell);
            _queueSignal.Release();
        }

        public async Task<BoardCellDTO?> DequeueAsync(CancellationToken cancellationToken)
        {
            await _queueSignal.WaitAsync(cancellationToken);
            _setBoardCellQueue.TryDequeue(out var boardCell);

            return boardCell;
        }
    }
}

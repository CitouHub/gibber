using gibbr.Common;
using gibbr.Domain;
using Microsoft.AspNetCore.SignalR;

namespace gibbr.API.SignalR
{
    public interface IBoardHubClientManager
    {
        void AddClient(BoardClient boardClient);

        void RemoveClient(string? userId);

        Task<int> SendUpdateAsync(BoardCellDTO boardCell, CancellationToken cancellationToken);
    }

    public class BoardHubClientManager : IBoardHubClientManager
    {
        private readonly List<BoardClient> _boardClients = new();
        private readonly IHubContext<BoardHub> _hubContext;

        public BoardHubClientManager(IHubContext<BoardHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void AddClient(BoardClient boardClient)
        {
            _boardClients.Add(boardClient);
        }

        public void RemoveClient(string? userId)
        {
            var client = _boardClients.FirstOrDefault(x => x.UserId == userId);
            if (client is not null)
            {
                _boardClients.Remove(client);
            }
        }

        public async Task<int> SendUpdateAsync(BoardCellDTO boardCell, CancellationToken cancellationToken)
        {
            var messagesSent = 0;
            foreach (var connectionId in _boardClients.Where(_ => _.UserId != boardCell.UserId &&
                boardCell.X >= _.X && boardCell.X <= _.X + _.Dx &&
                boardCell.Y >= _.Y && boardCell.Y <= _.Y + _.Dy).Select(_ => _.ConnectionId))
            {
                await _hubContext.Clients.Client(connectionId)
                    .SendAsync(BoardHubMethod.UpdateBoard, boardCell, cancellationToken);
                messagesSent++;
            }

            return messagesSent;
        }
    }
}

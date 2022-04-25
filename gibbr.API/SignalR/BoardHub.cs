using Microsoft.AspNetCore.SignalR;

namespace gibbr.API.SignalR
{
    public class BoardHub : Hub
    {
        private readonly IBoardHubClientManager _boardHubClientManager;

        public BoardHub(IBoardHubClientManager boardHubClientManager)
        {
            _boardHubClientManager = boardHubClientManager;
        }

        public override async Task OnConnectedAsync()
        {
            var query = Context.GetHttpContext()?.Request.Query;
            if(query != null)
            {
                _boardHubClientManager.AddClient(new BoardClient()
                {
                    X = Convert.ToInt64(query["x"]),
                    Y = Convert.ToInt64(query["y"]),
                    Dx = Convert.ToInt16(query["dx"]),
                    Dy = Convert.ToInt16(query["dy"]),
                    UserId = query["userId"].ToString() ?? "",
                    ConnectionId = Context.ConnectionId
                });

                await base.OnConnectedAsync();
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var query = Context.GetHttpContext()?.Request.Query;
            var userId = query?.ToString();
            _boardHubClientManager.RemoveClient(userId);

            await base.OnDisconnectedAsync(exception);
        }
    }
}

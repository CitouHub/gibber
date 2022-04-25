namespace gibbr.API.SignalR
{
    public class BoardClient
    {
        public long X { get; set; }
        public long Y { get; set; }
        public short Dx { get; set; }
        public short Dy { get; set; }
        public string UserId { get; set; } = "";
        public string ConnectionId { get; set; } = "";
    }
}

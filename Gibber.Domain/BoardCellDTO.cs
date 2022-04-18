using System.Text.Json.Serialization;

namespace Gibber.Domain
{
    public class BoardCellDTO
    {
        [JsonPropertyName("x")]
        public long X { get; set; }

        [JsonPropertyName("y")]
        public long Y { get; set; }

        [JsonPropertyName("u")]
        public string? UserId { get; set; }

        [JsonPropertyName("l")]
        public string? Letter { get; set; }

        public override string ToString()
        {
            return $"{X}:{Y}:{Letter}";
        }
    }
}
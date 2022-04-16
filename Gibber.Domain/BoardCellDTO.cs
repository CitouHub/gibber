namespace Gibber.Domain
{
    public class BoardCellDTO
    {
        public long X { get; set; }
        public long Y { get; set; }
        public char L { get; set; }
        public string? Source { get; set; }

        public override string ToString()
        {
            return $"{X}:{Y}:{L}";
        }
    }
}
using System;
using System.Collections.Generic;

namespace Gibbr.Data
{
    public partial class BoardCell
    {
        public long X { get; set; }
        public long Y { get; set; }
        public string UserId { get; set; } = null!;
        public DateTime InsertDate { get; set; }
        public string Letter { get; set; } = null!;
        public string? Color { get; set; }
        public string? Background { get; set; }
    }
}

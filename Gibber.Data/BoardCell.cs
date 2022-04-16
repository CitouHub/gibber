using System;
using System.Collections.Generic;

namespace Gibber.Data
{
    public partial class BoardCell
    {
        public long X { get; set; }
        public long Y { get; set; }
        public DateTime InsertDate { get; set; }
        public string Letter { get; set; } = null!;
        public string? Color { get; set; }
        public string? Background { get; set; }
        public string Source { get; set; } = null!;
    }
}

namespace gibbr.Common
{
    public static class LetterFormat
    {
        public static string Escape(string? letter)
        {
            if (letter is not null)
            {
                if (letter == "\'")
                {
                    return "\'";
                }
                if (letter == "{")
                {
                    return "{";
                }
                if (letter == "}")
                {
                    return "}";
                }
            }

            return "";
        }
    }
}
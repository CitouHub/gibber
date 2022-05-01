using gibbr.Common;

using Xunit;

namespace gibbr.Test.Util
{
    public class LetterFormatTest
    {
        [Theory]
        [InlineData("\'")]
        [InlineData("}")]
        [InlineData("{")]
        public void Escaped(string letter)
        {
            //Act
            var result = LetterFormat.Escape(letter);

            //Assert
            Assert.Equal(letter, result);
        }

        [Theory]
        [InlineData("a")]
        [InlineData("z")]
        [InlineData("0")]
        [InlineData("9")]
        public void Not_Escaped(string letter)
        {
            //Act
            var result = LetterFormat.Escape(letter);

            //Assert
            Assert.Equal("", result);
        }
    }
}

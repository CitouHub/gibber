DELETE BoardCell WHERE X >= -43 AND X <= 43 AND Y >= -23 AND Y <= 12

DECLARE @I TABLE(I INT NOT NULL)
INSERT INTO @I
SELECT (ones.n + 10*tens.n)
FROM (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) ones(n),
        (VALUES(0),(1),(2),(3),(4),(5),(6),(7),(8),(9)) tens(n)
ORDER BY 1

INSERT INTO BoardCell (X, Y, Letter, UserId)
SELECT X.I - 43, Y.I - 23, '.', 'Landing' FROM @I AS X
	INNER JOIN @I AS Y ON Y.I <= 35
WHERE X.I <= 86
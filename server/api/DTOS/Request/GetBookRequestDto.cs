namespace api.DTOS.Request;

public record GetBookRequestDto
{
    public int Skip { get; set; }
    public int Take { get; set; }
    public BookOrderingOptions Ordering { get; set; }
    public bool Descending { get; set; }
}

public enum BookOrderingOptions
{
    Name,
    NumberOfBooksPublished,
}
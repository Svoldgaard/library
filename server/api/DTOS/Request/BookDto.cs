

public class BookDto
{
    public BookDto()
    {
        
    }
    
    public string Id { get; set; } = null!;

    public string Title { get; set; } = null!;

    public int Pages { get; set; }

    public DateTime? Createdat { get; set; }

    public string? Genreid { get; set; }

    public virtual GenreDto? Genre { get; set; }

    public virtual ICollection<AuthorDto> Authors { get; set; } = new List<AuthorDto>();
}
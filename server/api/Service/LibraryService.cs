

using api.DTOS.Request;
using Infrastructure.Postgres.Scaffolding;

public class LibraryService(MyDbContext ctx) : ILibraryService
{
    public async Task<List<BookDto>> GetBooks()
    {
        return NotImplementedException;
    }

    public async Task<List<AuthorDto>> GetAuthors()
    {
        return NotImplementedException;
    }

    public async Task<List<GenreDto>> GetGenres()
    {
        return NotImplementedException;
    }

    public async Task<List<BookDto>> CreateBook(CreateBookDtoRequest dto)
    {
        return NotImplementedException;
    }

    public async Task<List<BookDto>> UpdateBook(UpdateBookDtoRequest dto)
    {
        return NotImplementedException;
    }

    public async Task<BookDto> DeleteBook(string id)
    {
        return NotImplementedException;
    }

}

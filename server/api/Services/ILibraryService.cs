

using api.DTOS.Request;

public interface ILibraryService
{
    Task<List<BookDto>> GetBooks();
    Task<List<AuthorDto>> GetAuthors();
    Task<List<GenreDto>> GetGenres();
    
    Task<BookDto> CreateBook(CreateBookDtoRequest dto);
    Task<BookDto> UpdateBook(UpdateBookDtoRequest dto);
    Task<BookDto> DeleteBook(string id);
}
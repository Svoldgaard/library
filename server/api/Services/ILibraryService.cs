using api.DTOS.Request;
using efscaffold.Entities;

public interface ILibraryService
{
    Task<List<Book>> GetBooks(GetBookRequestDto dto);
    Task<List<AuthorDto>> GetAuthors();
    Task<List<GenreDto>> GetGenres();
    
    Task<BookDto> CreateBook(CreateBookDtoRequest dto);
    Task<BookDto> UpdateBook(UpdateBookDtoRequest dto);
    Task<BookDto> DeleteBook(string id);
}
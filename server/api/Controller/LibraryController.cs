

using api.DTOS.Request;
using Microsoft.AspNetCore.Mvc;

public class LibraryController (ILibraryService libraryService) : ControllerBase
{
    [Route(nameof(GetAuthors))]
    [HttpGet]
    public async Task<List<AuthorDto>> GetAuthors()
    {
        return await libraryService.GetAuthors();
    }

    [HttpGet(nameof(GetBooks))]
    public async Task<List<BookDto>> GetBooks()
    {
        return await libraryService.GetBooks();
    }

    [HttpGet(nameof(GetGenres))]
    public async Task<List<GenreDto>> GetGenres()
    {
        return await libraryService.GetGenres();
    }

    [HttpPost(nameof(CreateBook))]
    public async Task<BookDto> CreateBook([FromBody]CreateBookDtoRequest dto)
    {
        return await libraryService.CreateBook(dto);
    }

    [HttpPut(nameof(UpdateBook))]
    public async Task<BookDto> UpdateBook([FromBody] UpdateBookDtoRequest dto)
    {
        return await libraryService.UpdateBook(dto);
    }

    [HttpDelete(nameof(DeleteBook))]
    public async Task<BookDto> DeleteBook([FromQuery] string bookId)
    {
        return await libraryService.DeleteBook(bookId);
    }
    
}


using api.DTOS.Request;
using efscaffold.Entities;
using Microsoft.AspNetCore.Mvc;

public class LibraryController (ILibraryService libraryService) : ControllerBase
{
    
    [HttpGet(nameof(GetBooks))]
    public async Task<List<Book>> GetBooks(GetBookRequestDto dto)
    {
        return await libraryService.GetBooks(dto);
    }
    
    [Route(nameof(GetAuthors))]
    [HttpGet]
    public async Task<List<AuthorDto>> GetAuthors()
    {
        return await libraryService.GetAuthors();
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
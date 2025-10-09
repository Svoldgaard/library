

using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class LibraryController (ILibraryService libraryService, MyDbContext ctx) : ControllerBase
{
    
    [HttpPost(nameof(GetBooks))]
    public async Task<List<Book>> GetBooks([FromBody]GetBookRequestDto dto)
    {
        return await libraryService.GetBooks(dto);
    }

    [HttpGet(nameof(GetBooksDto))]
    public async Task<List<BookDto>> GetBooksDto()
    {
        return await libraryService.GetBooksDto();
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
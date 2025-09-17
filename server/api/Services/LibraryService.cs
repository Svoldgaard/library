using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Microsoft.EntityFrameworkCore;

public class LibraryService(MyDbContext ctx) : ILibraryService
{
    public Task<List<BookDto>> GetBooks()
    {
        return ctx.Books
            .Include(b => b.Authors) // load authors
            .Include(b => b.Genre)   // load genre
            .Select(b => new BookDto(b))
            .ToListAsync();
    }

    public Task<List<AuthorDto>> GetAuthors()
    {
        return ctx.Authors.Select(a => new AuthorDto(a)).ToListAsync();
    }

    public Task<List<GenreDto>> GetGenres()
    {
        return ctx.Genres.Select(g => new GenreDto(g)).ToListAsync();
    }

    public async Task<BookDto> CreateBook(CreateBookDtoRequest dto)
    {
        Validator.ValidateObject(dto, new ValidationContext(dto), true);

        var book = new Book()
        {
            Pages = dto.Pages,
            Createdat = DateTime.UtcNow,
            Id = Guid.NewGuid().ToString(),
            Title = dto.Title
        };
         ctx.Books.Add(book);
         await ctx.SaveChangesAsync();
         return new BookDto(book);
         
    }

    public async Task<BookDto> UpdateBook(UpdateBookDtoRequest dto)
    {
        Validator.ValidateObject(dto, new ValidationContext(dto), true);
        var book = ctx.Books.First(b => b.Id == dto.BookId);
        var genre = ctx.Genres.First(g => g.Id == dto.GenreId);
        book.Genre = genre;
        book.Pages = dto.Pages;
        book.Title = dto.Title;
        book.Authors = dto.AuthorsIds.Select(id => ctx.Authors.First(a => a.Id == id)).ToList();
        ctx.Books.Update(book);
        await ctx.SaveChangesAsync();
        return new BookDto(book);
    }

    public async Task<BookDto> DeleteBook(string bookId)
    {
        var book = ctx.Books.First(b => b.Id == bookId);
        ctx.Books.Remove(book);
        await ctx.SaveChangesAsync();
        return new BookDto(book);
    }

}

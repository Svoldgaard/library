using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests;

public class LibraryServiceTests(ILibraryService service, MyDbContext ctx)
{
    // Unhappy path 
    [Fact]
    public async Task CreateBook_ShouldThrow_WhenValidationFails()
    {
        var dto = new CreateBookDtoRequest
        {
            Title = "",
            Pages = 0
        };
        await Assert.ThrowsAnyAsync<ValidationException>(() => service.CreateBook(dto));
    }

    [Fact]
    public async Task UpdateBook_ShouldThrow_WhenBookDoesNotExist()
    {
        var author = new Author { Id = "a1", Name = "Author 1" };
        ctx.Authors.Add(author);
        await ctx.SaveChangesAsync();

        var dto = new UpdateBookDtoRequest
        {
            BookId = "non-existent-id",
            Title = "Title",
            Pages = 100,
            GenreId = "genre1",
            AuthorsIds = new List<string> { author.Id }
        };
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.UpdateBook(dto));
    }

    [Fact]
    public async Task DeleteBook_ShouldThrow_WhenBookDoesNotExist()
    {
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.DeleteBook("non-existent-id"));
    }

    // Happy path
    [Fact]
    public async Task CreateBook_ShouldInsertBook_WhenValid()
    {
        Assert.Equal(0, ctx.Books.Count());
        var dto = new CreateBookDtoRequest
        {
            Title = "Clean Code",
            Pages = 464
        };
        var result = await service.CreateBook(dto);
        Assert.Equal(1, ctx.Books.Count());
        Assert.Equal("Clean Code", result.Title);
        Assert.False(string.IsNullOrEmpty(result.Id));
    }

    [Fact]
    public async Task UpdateBook_ShouldModifyBook_WhenValid()
    {
        var createDto = new CreateBookDtoRequest { Title = "Old Title", Pages = 100 };
        var book = await service.CreateBook(createDto);

        var genre = new Genre { Id = "g1", Name = "Fiction" };
        ctx.Genres.Add(genre);

        var author = new Author { Id = "a1", Name = "Author 1" };
        ctx.Authors.Add(author);

        await ctx.SaveChangesAsync();

        var updateDto = new UpdateBookDtoRequest
        {
            BookId = book.Id,
            Title = "New Title",
            Pages = 200,
            GenreId = genre.Id,
            AuthorsIds = new List<string> { author.Id }
        };

        var updated = await service.UpdateBook(updateDto);

        Assert.Equal("New Title", updated.Title);
        Assert.Equal(200, updated.Pages);
        Assert.Equal("Fiction", updated.Genre.Name);
        Assert.Single(updated.AuthorsIds);
        Assert.Contains(author.Id, updated.AuthorsIds);
    }

    [Fact]
    public async Task DeleteBook_ShouldRemoveBook_WhenValid()
    {
        var dto = new CreateBookDtoRequest
        {
            Title = "To Delete",
            Pages = 100
        };
        var created = await service.CreateBook(dto);
        Assert.Equal(1, ctx.Books.Count());
        var deleted = await service.DeleteBook(created.Id);
        Assert.Equal("To Delete", deleted.Title);
        Assert.Empty(ctx.Books);
    }

    [Fact]
    public async Task GetBooks_ShouldReturnAllBooks()
    {
        await service.CreateBook(new CreateBookDtoRequest { Title = "Book1", Pages = 100 });
        await service.CreateBook(new CreateBookDtoRequest { Title = "Book2", Pages = 200 });
        var books = await service.GetBooks();
        Assert.Equal(2, books.Count);
        Assert.Contains(books, b => b.Title == "Book1");
        Assert.Contains(books, b => b.Title == "Book2");
    }

    [Fact]
    public async Task GetAuthors_ShouldReturnAllAuthors()
    {
        ctx.Authors.Add(new Author { Id = "a1", Name = "Author 1" });
        ctx.Authors.Add(new Author { Id = "a2", Name = "Author 2" });
        await ctx.SaveChangesAsync();
        var authors = await service.GetAuthors();
        Assert.Equal(2, authors.Count);
        Assert.Contains(authors, a => a.Name == "Author 1");
        Assert.Contains(authors, a => a.Name == "Author 2");
    }

    [Fact]
    public async Task GetGenres_ShouldReturnAllGenres()
    {
        ctx.Genres.Add(new Genre { Id = "g1", Name = "Fiction" });
        ctx.Genres.Add(new Genre { Id = "g2", Name = "Non-Fiction" });
        await ctx.SaveChangesAsync();
        var genres = await service.GetGenres();
        Assert.Equal(2, genres.Count);
        Assert.Contains(genres, g => g.Name == "Fiction");
        Assert.Contains(genres, g => g.Name == "Non-Fiction");
    }
}

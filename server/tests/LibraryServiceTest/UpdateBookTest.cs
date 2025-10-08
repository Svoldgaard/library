using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests.LibraryServiceTest;

public class UpdateBookTest(ILibraryService service, MyDbContext ctx)
{
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
}
using System.ComponentModel.DataAnnotations;
using Server.api.DTOS.Request;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests;

public class LibraryServiceTests(ILibraryService service, MyDbContext ctx)
{
    [Fact]
    public async Task CreateBook_ShouldThrow_WhenValidationFails()
    {
        var dto = new CreateBookDtoRequest
        {
            Title = "", // invalid
            Pages = 0
        };

        await Assert.ThrowsAnyAsync<ValidationException>(() => service.CreateBook(dto));
    }

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
    public async Task DeleteBook_ShouldRemoveBook()
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
}
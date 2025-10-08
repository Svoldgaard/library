using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests.LibraryServiceTest;

public class CreateBookTest(ILibraryService service, MyDbContext ctx)
{
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
}
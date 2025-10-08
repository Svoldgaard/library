using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests.LibraryServiceTest;


public class DeleteBookTest(ILibraryService service, MyDbContext ctx)
{
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
    public async Task DeleteBook_ShouldThrow_WhenBookDoesNotExist()
    {
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.DeleteBook("non-existent-id"));
    }
}
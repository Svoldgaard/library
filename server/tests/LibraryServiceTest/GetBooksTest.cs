using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests.LibraryServiceTest;

public class GetBooksTest
{
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
}
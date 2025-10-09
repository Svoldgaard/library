using System.ComponentModel.DataAnnotations;
using api;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests.LibraryServiceTest;

public class GetBooksTest(ILibraryService service, MyDbContext ctx)
{
    /*[Fact]
    public async Task GetBooks_ShouldReturnAllBooks()
    {
        var dto = new GetBookRequestDto()
        {
            Skip = 0,
            Take = 1,


        };
        
        await service.CreateBook(new CreateBookDtoRequest { Title = "Book1", Pages = 100 });
        await service.CreateBook(new CreateBookDtoRequest { Title = "Book2", Pages = 200 });
        var books = await service.GetBooks(dto);
        //Assert.Equal(2, books.Count);
        Assert.Contains(books, b => b.Title == "Book1");
        Assert.Contains(books, b => b.Title == "Book2");
    }*/

    [Fact]
    public async Taks GetBooksWithPaginationAndNameOrdering_Works()
    {

        var seeder = new SeederWithRelations(ctx);
        await seeder.Seed();
        
        var dto = new GetBookRequestDto()
        {
            Skip = 0,
            Take = 10,
            Ordering = BookOrderingOptions.NumberOfBooksPublished
        };
        
        var actual = await service.GetBooks(dto);
        
        Assert.Equal("0",actual.First(),Id);
        
    }
}
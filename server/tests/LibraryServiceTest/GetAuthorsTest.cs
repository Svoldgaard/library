using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests.LibraryServiceTest;

public class GetAuthorsTest(ILibraryService service, MyDbContext ctx)
{
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
}
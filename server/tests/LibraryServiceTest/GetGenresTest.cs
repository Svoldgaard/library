using System.ComponentModel.DataAnnotations;
using api.DTOS.Request;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Xunit;

namespace tests.LibraryServiceTest;

public class GetGenresTest(ILibraryService service, MyDbContext ctx)
{
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
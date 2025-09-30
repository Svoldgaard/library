using Infrastructure.Postgres.Scaffolding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using Testcontainers.PostgreSql;

namespace tests;

public class Startup
{
    public static void ConfigureServices(IServiceCollection services)
    {
        // Reuse your app's ConfigureServices from Server/Program.cs
        Program.ConfigureServices(services);

        // Remove the default DbContext (so we can inject a test one)
        services.RemoveAll(typeof(MyDbContext));

        // Replace with a testcontainer-backed DbContext
        services.AddScoped<MyDbContext>(factory =>
        {
            var postgreSqlContainer = new PostgreSqlBuilder().Build();
            postgreSqlContainer.StartAsync().GetAwaiter().GetResult();

            var connectionString = postgreSqlContainer.GetConnectionString();
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseNpgsql(connectionString)
                .Options;

            var ctx = new MyDbContext(options);
            ctx.Database.EnsureCreated(); // initialize schema
            return ctx;
        });
    }
}
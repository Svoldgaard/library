using System.ComponentModel.DataAnnotations;
using api;
using Infrastructure.Postgres.Scaffolding;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void ConfigureServices(IServiceCollection services)
    {

        services.AddSingleton<AppOptions>(provider =>
        {
            var configuration = provider.GetRequiredService<IConfiguration>();
            var appOptions = new AppOptions();
            configuration.GetSection(nameof(AppOptions)).Bind(appOptions);
            return appOptions;
        });
        services.AddDbContext<MyDbContext>((services, options) =>
        {
            options.UseNpgsql(services.GetRequiredService<AppOptions>().Db);
        });
        services.AddControllers();
        services.AddOpenApiDocument();
        //services.AddCors();
        services.AddCors(options =>
        {
            options.AddPolicy("AllowClient", policy =>
            {
                policy.WithOrigins(
                        "http://localhost:5173",
                        "https://libraryclient.fly.dev") // 👈 your frontend domain
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
        services.AddScoped<ILibraryService, LibraryService>();
        services.AddScoped<ISeeder, Seeder>();
        
    }

    public static void Main()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Configuration.AddEnvironmentVariables();
        ConfigureServices(builder.Services);
        var app = builder.Build();


        var appOptions = app.Services.GetRequiredService<AppOptions>();
        Validator.ValidateObject(appOptions, new ValidationContext(appOptions), true);
        app.UseExceptionHandler("/error");
        app.Map("/error", (HttpContext httpContext) =>
        {
            var logger = httpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            var exceptionHandlerFeature = httpContext.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
            if (exceptionHandlerFeature != null)
            {
                logger.LogError(exceptionHandlerFeature.Error, "Unhandled exception");
            }
            return Results.Problem("An unexpected error occurred.");
        });
        app.UseOpenApi();
        app.UseSwaggerUi();
        app.UseRouting();
        //app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(x => true));
        app.UseCors("AllowClient");
        app.UseAuthorization();
        app.MapControllers();
        app.GenerateApiClientsFromOpenApi("/../../client/src/generated-client.ts").GetAwaiter().GetResult();
        //if (app.Environment.IsDevelopment())
        //{
        //    using (var scope = app.Services.CreateScope())
        //    {
        //        var seeder = scope.ServiceProvider.GetService<ISeeder>();
        //        if (seeder != null)
        //        {
        //            seeder.Seed();
        //        }
        //    }
        //}

        app.Run();

    }
}    


using System.ComponentModel.DataAnnotations;

namespace api;

public class AppOptions
{
    [MinLength(1)]
    public string Db { get; set; } = null!;

    [MinLength(1)] public string JwtSecret { get; set; } = null!;
}
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure the database
        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<User>().Property(u => u.Id).ValueGeneratedOnAdd();
        // Seed data
        using (var r = new StreamReader("user_seed.json"))
        {
            var json = r.ReadToEnd();
            var users = JsonSerializer.Deserialize<User[]>(json, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            if (users is not null)
            {
                foreach (var u in users)
                {
                    modelBuilder.Entity<User>().HasData(u);
                }
            }
        }
        base.OnModelCreating(modelBuilder);
    }

    public required DbSet<User> Users { get; set; }
}

public class User
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

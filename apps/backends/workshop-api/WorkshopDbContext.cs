using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

public class WorkshopDbContext : DbContext
{
    public WorkshopDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure the database
        modelBuilder.Entity<Workshop>().HasKey(w => w.Id);
        modelBuilder.Entity<Workshop>().Property(w => w.Id).ValueGeneratedOnAdd().Metadata.SetBeforeSaveBehavior(PropertySaveBehavior.Ignore);
        // Seed data
        using (var r = new StreamReader("workshop_seed.json"))
        {
            var json = r.ReadToEnd();
            var workshops = JsonSerializer.Deserialize<Workshop[]>(json, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            if (workshops is not null)
            {
                foreach (var w in workshops)
                {
                    modelBuilder.Entity<Workshop>().HasData(w);
                }
            }
        }
        base.OnModelCreating(modelBuilder);
    }

    public required DbSet<Workshop> Workshops { get; set; }
}

public class Workshop
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
}

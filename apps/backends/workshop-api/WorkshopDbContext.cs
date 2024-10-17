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
        modelBuilder.Entity<WorkshopParticipant>().HasKey(x => x.Id);
        modelBuilder.Entity<WorkshopParticipant>().Property(x => x.Id).ValueGeneratedOnAdd().Metadata.SetBeforeSaveBehavior(PropertySaveBehavior.Ignore);
        modelBuilder.Entity<WorkshopParticipant>().HasIndex(x => new { x.WorkshopId, x.UserId }).IsUnique();
        modelBuilder.Entity<Workshop>().HasMany(w => w.WorkShopParticipants).WithOne(x => x.Workshop).HasForeignKey(x => x.WorkshopId).OnDelete(DeleteBehavior.Cascade);
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
        using (var r = new StreamReader("workshop_participant_seed.json"))
        {
            var json = r.ReadToEnd();
            var workshopParticipants = JsonSerializer.Deserialize<WorkshopParticipant[]>(json, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            if (workshopParticipants is not null)
            {
                foreach (var w in workshopParticipants)
                {
                    modelBuilder.Entity<WorkshopParticipant>().HasData(w);
                }
            }
        }
        base.OnModelCreating(modelBuilder);
    }

    public required DbSet<Workshop> Workshops { get; set; }
    public required DbSet<WorkshopParticipant> WorkShopParticipants { get; set; }
}

public class Workshop
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public List<WorkshopParticipant> WorkShopParticipants { get; set; } = new();
}

public class WorkshopParticipant
{
    public int Id { get; set; }
    public int WorkshopId { get; set; }
    public int UserId { get; set; }
    public Workshop? Workshop { get; set; }
}

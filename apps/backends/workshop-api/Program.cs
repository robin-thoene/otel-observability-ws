using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
// TODO: add OpenTelemetry instrumentation here
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<WorkshopDbContext>(opt => opt.UseInMemoryDatabase("Db"));
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<WorkshopDbContext>();
    dbContext.Database.EnsureCreated();
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapGet("/workshops", async (WorkshopDbContext db, ILogger<Program> logger) =>
{
    var workshops = await db.Workshops.Select(w => new { Id = w.Id, Title = w.Title }).ToListAsync();
    logger.LogInformation("Found {WorkshopCount} workshops", workshops.Count());
    return Results.Ok(workshops);
}).WithOpenApi();
app.MapGet("/workshops/{id}", async (int id, WorkshopDbContext db, ILogger<Program> logger) =>
{
    var workshop = await db.Workshops.Include(w => w.WorkShopParticipants).FirstOrDefaultAsync(w => w.Id == id);
    if (workshop is null)
    {
        return Results.NotFound($"No workshop with id {id} exists");
    }
    var participants = new ExternalUser[] { };
    var query = new StringBuilder();
    if (workshop.WorkShopParticipants.Any())
    {
        var i = 0;
        foreach (var wp in workshop.WorkShopParticipants)
        {
            if (i == 0)
            {
                query.Append($"?userIds={wp.UserId}");
            }
            else
            {
                query.Append($"&userIds={wp.UserId}");
            }
            i++;
        }
        using var httpClient = new HttpClient();
        httpClient.BaseAddress = new Uri("http://localhost:5046");
        var response = await httpClient.GetAsync($"users{query.ToString()}");
        if (!response.IsSuccessStatusCode)
        {
            logger.LogError("Coud not get participants from the users api.");
            return Results.StatusCode(500);
        }
        participants = await response.Content.ReadFromJsonAsync<ExternalUser[]>(new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
    }
    return Results.Ok(new
    {
        Id = workshop.Id,
        Title = workshop.Title,
        Description = workshop.Description,
        Participants = participants
    });
}).WithOpenApi();
app.MapDelete("/workshops/{id}", async (int id, WorkshopDbContext db) =>
{
    var workshop = await db.Workshops.FirstOrDefaultAsync(w => w.Id == id);
    if (workshop is null)
    {
        return Results.NotFound($"No workshop with id {id} exists");
    }
    db.Workshops.Remove(workshop);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithOpenApi();
app.MapPost("/workshops", async ([FromBody] WorkshopCreateModel model, WorkshopDbContext db) =>
{
    var entity = new Workshop
    {
        Id = 0,
        Title = model.Title,
        Description = model.Description
    };
    db.Workshops.Add(entity);
    await db.SaveChangesAsync();
    return Results.Ok(entity);
}).WithOpenApi();
app.MapPut("/workshops", async ([FromBody] Workshop model, WorkshopDbContext db) =>
{
    var current = await db.Workshops.FirstOrDefaultAsync(w => w.Id == model.Id);
    if (current is null)
    {
        return Results.NotFound($"No workshop with id {model.Id} exists");
    }
    current.Title = model.Title;
    current.Description = model.Description;
    await db.SaveChangesAsync();
    return Results.Ok(current);
}).WithOpenApi();
app.MapPost("/workshops/participant", async ([FromBody] AddParticipantModel model, WorkshopDbContext db) =>
{
    var exist = await db.WorkShopParticipants.AnyAsync(x => x.UserId == model.UserId && x.WorkshopId == model.WorkshopId);
    if (exist)
    {
        return Results.BadRequest("The user is also stored as participant");
    }
    var entity = new WorkshopParticipant
    {
        Id = 0,
        WorkshopId = model.WorkshopId,
        UserId = model.UserId
    };
    var workshops = db.WorkShopParticipants.Add(entity);
    await db.SaveChangesAsync();
    return Results.Created();
}).WithOpenApi();
app.MapDelete("/workshops/{wid}/participant/{uid}", async (int wid, int uid, WorkshopDbContext db) =>
{
    var entity = await db.WorkShopParticipants.FirstOrDefaultAsync(x => x.UserId == uid && x.WorkshopId == wid);
    if (entity is null)
    {
        return Results.BadRequest("The provided user is no participant in the provided workshop");
    }
    var workshops = db.WorkShopParticipants.Remove(entity);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithOpenApi();
app.Run();

public class WorkshopCreateModel
{
    public required string Title { get; set; }
    public required string Description { get; set; }
}

public class AddParticipantModel
{
    public required int WorkshopId { get; set; }
    public required int UserId { get; set; }
}

public class ExternalUser
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

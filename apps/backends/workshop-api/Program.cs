using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
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
app.UseHttpsRedirection();
app.MapGet("/workshops", async (WorkshopDbContext db) =>
{
    var workshops = await db.Workshops.Select(w => new { Id = w.Id, Title = w.Title }).ToListAsync();
    return Results.Ok(workshops);
}).WithOpenApi();
app.MapGet("/workshops/{id}", async (int id, WorkshopDbContext db) =>
{
    var workshop = await db.Workshops.FirstOrDefaultAsync(w => w.Id == id);
    if (workshop is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(workshop);
}).WithOpenApi();
app.MapDelete("/workshops/{id}", async (int id, WorkshopDbContext db) =>
{
    var workshop = await db.Workshops.FirstOrDefaultAsync(w => w.Id == id);
    if (workshop is null)
    {
        return Results.NotFound();
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
    return Results.Created();
}).WithOpenApi();
app.MapPut("/workshops", async ([FromBody] Workshop model, WorkshopDbContext db) =>
{
    var current = await db.Workshops.FirstOrDefaultAsync(w => w.Id == model.Id);
    if (current is null)
    {
        return Results.NotFound();
    }
    current.Title = model.Title;
    current.Description = model.Description;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithOpenApi();
app.Run();

public class WorkshopCreateModel
{
    public required string Title { get; set; }
    public required string Description { get; set; }
}

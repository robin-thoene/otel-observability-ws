using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<UserDbContext>(opt => opt.UseInMemoryDatabase("Db"));
var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
    dbContext.Database.EnsureCreated();
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.MapGet("/users", async (UserDbContext db, int[]? userIds) =>
{
    var query = db.Users.AsQueryable();
    if (userIds is not null && userIds.Any())
    {
        query = query.Where(u => userIds.Contains(u.Id));
    }
    var users = await query.ToListAsync();
    return Results.Ok(users);
})
.WithOpenApi();
app.Run();

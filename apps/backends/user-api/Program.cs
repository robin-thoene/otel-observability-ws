using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;


var builder = WebApplication.CreateBuilder(args);
// add OpenTelemetry instrumentation here
var serviceName = "user-api";
var grpcEndpoint = "http://localhost:4317";
builder.Services.AddOpenTelemetry()
    .UseOtlpExporter(OtlpExportProtocol.Grpc, new Uri(grpcEndpoint))
    .ConfigureResource(res => res.AddService(serviceName))
    .WithTracing(t => t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation());
builder.Host.UseSerilog((ctx, services, config) =>
{
    config.MinimumLevel.Information()
        .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware", LogEventLevel.Warning)
        .MinimumLevel.Override("System.Net.Http.HttpClient", LogEventLevel.Warning)
        .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Warning);
    config.WriteTo.Console();
    config.WriteTo.OpenTelemetry(opt =>
    {
        opt.Endpoint = grpcEndpoint;
        opt.ResourceAttributes.Add("service.name", serviceName);
        opt.Protocol = Serilog.Sinks.OpenTelemetry.OtlpProtocol.Grpc;
    });
});
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
app.MapGet("/users", async (UserDbContext db, ILogger<Program> logger, int[]? userIds, string? s) =>
{
    var query = db.Users.AsQueryable();
    if (userIds is not null && userIds.Any())
    {
        query = query.Where(u => userIds.Contains(u.Id));
    }
    if (!string.IsNullOrEmpty(s))
    {
        query = query.Where(u => u.LastName.Contains(s, StringComparison.InvariantCultureIgnoreCase) || u.FirstName.Contains(s, StringComparison.InvariantCultureIgnoreCase));
    }
    var users = await query.ToListAsync();
    logger.LogInformation("Found {UserCount} users", users.Count());
    return Results.Ok(users);
})
.WithOpenApi();
app.Run();

using AutoMapper;
using gibbr.API.BackgroundService;
using gibbr.API.Infrastructure;
using gibbr.API.SignalR;
using gibbr.Data;
using gibbr.Domain;
using gibbr.Service;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddRouting(options => options.LowercaseUrls = true);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<GibbrDbContext>(options => options.UseSqlServer(configuration.GetValue<string>("ConnectionString")));
builder.Services.AddDbContext<BaseDbContext>(options => options.UseSqlServer(configuration.GetValue<string>("ConnectionString")));
builder.Services.AddSignalR();
builder.Services.AddMvc()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});
var mappingConfig = new MapperConfiguration(config =>
{
    config.AddProfile(new AutoMapperProfile());
});
var mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddSingleton<ISetBoardCellQueue, SetBoardCellQueue>();
builder.Services.AddSingleton<IBoardHubClientManager, BoardHubClientManager>();
builder.Services.AddScoped<IBoardService, BoardService>();
builder.Services.AddHostedService<UpdateBoardBackgroundService>();
builder.Services.AddHostedService<DatabaseMigrationBackgroundService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(builder => builder
    .WithOrigins(configuration.GetValue<string>("Cors:Origin"))
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());

app.UseRouting();
app.UseEndpoints(_ => _.MapHub<BoardHub>("/hubs/board"));
app.MapControllers();

app.Run();

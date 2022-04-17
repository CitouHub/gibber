using AutoMapper;
using Gibber.API.BackgroundService;
using Gibber.API.Infrastructure;
using Gibber.Data;
using Gibber.Domain;
using Gibber.Service;
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
builder.Services.AddDbContext<GibberDbContext>(options => options.UseSqlServer(configuration.GetValue<string>("ConnectionString")));
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
builder.Services.AddSingleton<IAddBoardCellQueue, AddBoardCellQueue>();
builder.Services.AddScoped<IBoardService, BoardService>();
builder.Services.AddHostedService<UpdateBoardBackgroundService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapControllers();

app.Run();

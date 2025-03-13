using Server.Core.IRepositories;
using Server.Data.Repositories;
using Server.Core.IServices;
using System.Text.Json.Serialization;
using Server.Service;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.API;
using Server.Core;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
});


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                 Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IExamRepository, ExamRepository>();
builder.Services.AddScoped<ITopicRepository, TopicRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<ITopicService, TopicService>();
builder.Services.AddScoped<IDataContext,DataContext>();
builder.Services.AddAutoMapper(typeof(MappingProfile), typeof(MappingPostProfile));

builder.Services.AddDbContext<IDataContext, DataContext>(
    options => options.UseSqlServer(@"Server=(localdb)\MSSQLLocalDB;Database=ExamsCheckerDB"));
//builder.Services.AddDbContext<DataContext>(
//    options => options.UseMySql(
//        "server=bygljohvlznnah8fy7a7-mysql.services.clever-cloud.com;database=bygljohvlznnah8fy7a7;user=ueb9fmdhiqcwfkgg;password=C7H2J9SuOtXATsY8WAGx;",
//        ServerVersion.AutoDetect("server=bygljohvlznnah8fy7a7-mysql.services.clever-cloud.com;database=bygljohvlznnah8fy7a7;user=ueb9fmdhiqcwfkgg;password=C7H2J9SuOtXATsY8WAGx;")));

// Add DbContext
//builder.Services.AddDbContext<DataContext>(options =>
//options.UseMySql("server=bgxl1fzgfqll4yjsc9pk-mysql.services.clever-cloud.com;database=bgxl1fzgfqll4yjsc9pk;user=uuclu0bsh6uzghpb;password=uslPHljuK4PTjQWk9GsI",
//    ServerVersion.AutoDetect("server=bgxl1fzgfqll4yjsc9pk-mysql.services.clever-cloud.com;database=bgxl1fzgfqll4yjsc9pk;user=uuclu0bsh6uzghpb;password=uslPHljuK4PTjQWk9GsI")));
//builder.Services.AddDbContext<DataContext>(
//   options => options.UseNpgsql("Host=db.bgwzqydplkeilhgvrmqc.supabase.co;Database=postgres;Username=postgres;Password=Zz214864670;SSL Mode=Require;Trust Server Certificate=true"));


builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
{
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Server.API");
    });
}



app.UseCors("MyPolicy");


app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

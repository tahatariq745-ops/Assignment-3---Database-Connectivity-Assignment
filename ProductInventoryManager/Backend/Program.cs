using Microsoft.EntityFrameworkCore;
using ProductInventoryManager.Data;
using ProductInventoryManager.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("FrontendPolicy");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.MapGet("/", () => Results.Ok(new
{
    message = "Product Inventory Manager API is running.",
    productsEndpoint = "/api/products"
}));

app.MapGet("/api/products", async (AppDbContext db) =>
{
    var products = await db.Products
        .OrderBy(product => product.Name)
        .Select(product => new ProductResponse(
            product.Id,
            product.Name,
            product.Category,
            product.Price,
            product.Quantity,
            product.Supplier,
            product.CreatedAt))
        .ToListAsync();

    return Results.Ok(products);
});

app.MapGet("/api/products/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);

    return product is null
        ? Results.NotFound(new { message = "Product not found." })
        : Results.Ok(new ProductResponse(
            product.Id,
            product.Name,
            product.Category,
            product.Price,
            product.Quantity,
            product.Supplier,
            product.CreatedAt));
});

app.MapPost("/api/products", async (ProductRequest request, AppDbContext db) =>
{
    var validationErrors = ValidateProduct(request);
    if (validationErrors.Count > 0)
    {
        return Results.ValidationProblem(validationErrors);
    }

    var product = new Product
    {
        Name = request.Name.Trim(),
        Category = request.Category.Trim(),
        Price = request.Price,
        Quantity = request.Quantity,
        Supplier = string.IsNullOrWhiteSpace(request.Supplier) ? null : request.Supplier.Trim(),
        CreatedAt = DateTime.UtcNow
    };

    db.Products.Add(product);
    await db.SaveChangesAsync();

    var response = new ProductResponse(
        product.Id,
        product.Name,
        product.Category,
        product.Price,
        product.Quantity,
        product.Supplier,
        product.CreatedAt);

    return Results.Created($"/api/products/{product.Id}", response);
});

app.MapPut("/api/products/{id:int}", async (int id, ProductRequest request, AppDbContext db) =>
{
    var validationErrors = ValidateProduct(request);
    if (validationErrors.Count > 0)
    {
        return Results.ValidationProblem(validationErrors);
    }

    var product = await db.Products.FindAsync(id);
    if (product is null)
    {
        return Results.NotFound(new { message = "Product not found." });
    }

    product.Name = request.Name.Trim();
    product.Category = request.Category.Trim();
    product.Price = request.Price;
    product.Quantity = request.Quantity;
    product.Supplier = string.IsNullOrWhiteSpace(request.Supplier) ? null : request.Supplier.Trim();

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/api/products/{id:int}", async (int id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null)
    {
        return Results.NotFound(new { message = "Product not found." });
    }

    db.Products.Remove(product);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();

static Dictionary<string, string[]> ValidateProduct(ProductRequest request)
{
    var errors = new Dictionary<string, string[]>();

    if (string.IsNullOrWhiteSpace(request.Name))
    {
        errors[nameof(request.Name)] = new[] { "Product name is required." };
    }
    else if (request.Name.Length > 100)
    {
        errors[nameof(request.Name)] = new[] { "Product name cannot exceed 100 characters." };
    }

    if (string.IsNullOrWhiteSpace(request.Category))
    {
        errors[nameof(request.Category)] = new[] { "Category is required." };
    }
    else if (request.Category.Length > 60)
    {
        errors[nameof(request.Category)] = new[] { "Category cannot exceed 60 characters." };
    }

    if (request.Price <= 0)
    {
        errors[nameof(request.Price)] = new[] { "Price must be greater than zero." };
    }

    if (request.Quantity < 0)
    {
        errors[nameof(request.Quantity)] = new[] { "Quantity cannot be negative." };
    }

    if (!string.IsNullOrWhiteSpace(request.Supplier) && request.Supplier.Length > 100)
    {
        errors[nameof(request.Supplier)] = new[] { "Supplier cannot exceed 100 characters." };
    }

    return errors;
}

public record ProductRequest(string Name, string Category, decimal Price, int Quantity, string? Supplier);

public record ProductResponse(int Id, string Name, string Category, decimal Price, int Quantity, string? Supplier, DateTime CreatedAt);

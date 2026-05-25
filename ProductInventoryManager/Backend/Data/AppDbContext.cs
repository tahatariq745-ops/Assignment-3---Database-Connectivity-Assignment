using Microsoft.EntityFrameworkCore;
using ProductInventoryManager.Models;

namespace ProductInventoryManager.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products");
            entity.HasKey(product => product.Id);
            entity.Property(product => product.Name).IsRequired().HasMaxLength(100);
            entity.Property(product => product.Category).IsRequired().HasMaxLength(60);
            entity.Property(product => product.Price).HasColumnType("decimal(18,2)").IsRequired();
            entity.Property(product => product.Quantity).IsRequired();
            entity.Property(product => product.Supplier).HasMaxLength(100);
            entity.Property(product => product.CreatedAt).IsRequired();
        });
    }
}

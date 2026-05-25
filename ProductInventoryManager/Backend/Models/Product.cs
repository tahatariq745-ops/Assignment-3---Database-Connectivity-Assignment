using System.ComponentModel.DataAnnotations;

namespace ProductInventoryManager.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(60)]
    public string Category { get; set; } = string.Empty;

    [Range(0.01, 9999999)]
    public decimal Price { get; set; }

    [Range(0, 1000000)]
    public int Quantity { get; set; }

    [MaxLength(100)]
    public string? Supplier { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

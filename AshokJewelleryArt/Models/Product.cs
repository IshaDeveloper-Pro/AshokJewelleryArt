using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AshokJewelleryArt.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        public string? Category { get; set; } // Gold, Silver, Diamond, etc.


        public string? Weight { get; set; } // Precision ke liye decimal

        public string? WeightUnit { get; set; } // gm, mg, carat

        public string? Gender { get; set; }
        public decimal? Price { get; set; }

        public string? ImageURL { get; set; }

        public bool? IsTrending { get; set; } 

        public bool IsNewArrival { get; set; }

        public string? Description { get; set; }
        public string? MetalType { get; set; }

        public string? SubCategory { get; set; } // Ring, Necklace, Bangle


        /* [Column("SubCategory")]*/
        public string? MaterialType { get; set; }

        public DateTime CreatedAt { get; set; } 
    }
}

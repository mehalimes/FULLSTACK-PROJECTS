using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace e_commerce_back_api.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductId { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public string PublicId { get; set; }
        public List<Order>? Orders { get; set; }
        public List<Cart>? Carts { get; set; }
        public Product() 
        { 
            Carts = new List<Cart>();
        }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace e_commerce_back_api.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }
        public AppUser User { get; set; }
        public int UserId { get; set; } 
        public List<Product> Products { get; set; }
        public DateTime OrderTime { get; set; }
        public string Address { get; set; }
        public bool IsFulFilled { get; set; }
        public int TotalPrice { get; set; }
    }
}

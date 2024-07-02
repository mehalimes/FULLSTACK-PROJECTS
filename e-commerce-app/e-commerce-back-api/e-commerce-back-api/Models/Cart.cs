using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace e_commerce_back_api.Models
{
    public class Cart
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CartId { get; set; }
        [JsonIgnore]
        public AppUser User { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public List<Product> Products { get; set; }

        public Cart()
        {
            Products = new List<Product>();
        }
    }
}

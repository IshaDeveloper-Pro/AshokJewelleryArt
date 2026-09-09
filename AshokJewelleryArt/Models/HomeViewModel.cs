namespace AshokJewelleryArt.Models
{
    public class HomeViewModel
    {
        // Isme hum trending products ki list rakhenge
        public List<Product> TrendingProducts { get; set; } = new List<Product>();

        // Future mein aap yahan aur bhi cheezein add kar sakte ho
        // Jaise: public List<Product> NewArrivals { get; set; }

        public List<Product> Products { get; set; }= new List<Product>();

        public List<Product> NewArrivals { get; set; } = new List<Product>();

    }
    

}

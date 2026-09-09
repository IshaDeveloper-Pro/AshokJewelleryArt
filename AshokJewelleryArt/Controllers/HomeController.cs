using AshokJewelleryArt.Data;
using AshokJewelleryArt.Models;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;


namespace AshokJewelleryArt.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            try
            {
                string ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                if (ipAddress == "::1")
                {
                    ipAddress = "127.0.0.1";
                }

                string location = "India";
                try
                {
                    using (var client = new System.Net.WebClient())
                    {
                        string json = client.DownloadString($"https://ipapi.co/{ipAddress}/json/");

                        // Using .NET's inbuilt JsonDocument to avoid Newtonsoft errors

                        using (System.Text.Json.JsonDocument doc = System.Text.Json.JsonDocument.Parse(json))
                        {
                            System.Text.Json.JsonElement root = doc.RootElement;
                            if (root.TryGetProperty("city", out System.Text.Json.JsonElement cityElem) &&
                                root.TryGetProperty("country_name", out System.Text.Json.JsonElement countryElem))
                            {
                                location = $"{cityElem.GetString()}, {countryElem.GetString()}";
                            }
                        }
                    }
                }
                catch
                {
                    location = "Mumbai, India"; // Fallback in case the API is slow or fails
                }

                string insertQuery = "INSERT INTO VisitorLogs (IpAddress, Location) VALUES ({0}, {1})";
                await _context.Database.ExecuteSqlRawAsync(insertQuery, ipAddress, location);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Tracking Error: " + ex.Message);
            }

         
            var model = new HomeViewModel();

            model.TrendingProducts = await _context.Products
       .Where(p => p.IsTrending == true) 
       .OrderBy(p => p.Id)
       .Take(4)
       .ToListAsync();

            model.NewArrivals = await _context.Products
      .Where(p => p.Category == "New Arrival") 
      .OrderByDescending(p => p.Id)            
      .Take(6)                                
      .ToListAsync();

            model.Products = await _context.Products.ToListAsync();

            return View(model);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Category(string type, string metal, string weight,string sortBy)
        {
            if (string.IsNullOrEmpty(type))
                return RedirectToAction("Index");

            // 1. Base Query 
            var query = _context.Products.AsQueryable();

            // 2. Category match logic
            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(p => p.SubCategory == type || p.Category == type || (p.Category + " " + p.SubCategory).Contains(type));
            }

            // 3. METAL FILTER ( to stop Gold/Silver mix 
            if (!string.IsNullOrEmpty(metal))
            {
                query = query.Where(p => p.MetalType == metal || p.Category == metal);
            }

            // 4. WEIGHT FILTER
            // 4. WEIGHT / CARAT FILTER
            if (!string.IsNullOrEmpty(weight))
            {
                var allProducts = query.ToList();

                // Handle Grams filters (for Gold, Silver, etc.)
                if (weight == "0-10")
                {
                    allProducts = allProducts.Where(p => ExtractWeightNumber(p.Weight) <= 10).ToList();
                }
                else if (weight == "10-20")
                {
                    allProducts = allProducts.Where(p => ExtractWeightNumber(p.Weight) > 10 && ExtractWeightNumber(p.Weight) <= 20).ToList();
                }
                else if (weight == "20+")
                {
                    allProducts = allProducts.Where(p => {
                        string wStr = p.Weight ?? "";
                        var numbers = System.Text.RegularExpressions.Regex.Matches(wStr, @"\d+(\.\d+)?")
                                        .Cast<System.Text.RegularExpressions.Match>()
                                        .Select(m => double.Parse(m.Value))
                                        .ToList();

                        if (numbers.Any())
                        {
                            return numbers.Max() >= 20;
                        }
                        return false;
                    }).ToList();
                }
                // Handle Carat filters (Below 1ct)
                else if (weight == "0-1")
                {
                    allProducts = allProducts.Where(p => {
                        string wStr = p.Weight ?? "";
                        var numbers = System.Text.RegularExpressions.Regex.Matches(wStr, @"\d+(\.\d+)?")
                                        .Cast<System.Text.RegularExpressions.Match>()
                                        .Select(m => double.Parse(m.Value))
                                        .ToList();

                        if (numbers.Any())
                        {
                            // Check if the minimum weight in the range is less than 1
                            return numbers.Min() < 1;
                        }
                        return false;
                    }).ToList();
                }
                // Handle Carat filters (for Diamond, Gemstone, Emerald)
                else if (weight == "0-0.5")
                {
                    allProducts = allProducts.Where(p => {
                        string wStr = p.Weight ?? "";
                        var match = System.Text.RegularExpressions.Regex.Match(wStr, @"\d+(\.\d+)?");
                        if (match.Success && decimal.TryParse(match.Value, out decimal val))
                        {
                            return val < 0.5m;
                        }
                        return false;
                    }).ToList();
                }
                else if (weight == "0.5-1")
                {
                    allProducts = allProducts.Where(p => {
                        string wStr = p.Weight ?? "";
                        var match = System.Text.RegularExpressions.Regex.Match(wStr, @"\d+(\.\d+)?");
                        if (match.Success && decimal.TryParse(match.Value, out decimal val))
                        {
                            return val >= 0.5m && val <= 1.0m;
                        }
                        return false;
                    }).ToList();
                }
                else if (weight == "1-2")
                {
                    allProducts = allProducts.Where(p => {
                        string wStr = p.Weight ?? "";
                        var match = System.Text.RegularExpressions.Regex.Match(wStr, @"\d+(\.\d+)?");
                        if (match.Success && decimal.TryParse(match.Value, out decimal val))
                        {
                            return val > 1.0m && val <= 2.0m;
                        }
                        return false;
                    }).ToList();
                }
                else if (weight == "2+")
                {
                    allProducts = allProducts.Where(p => {
                        string wStr = p.Weight ?? "";
                        var numbers = System.Text.RegularExpressions.Regex.Matches(wStr, @"\d+(\.\d+)?")
                                        .Cast<System.Text.RegularExpressions.Match>()
                                        .Select(m => decimal.Parse(m.Value))
                                        .ToList();

                        if (numbers.Any())
                        {
                            return numbers.Max() > 2.0m;
                        }
                        return false;
                    }).ToList();
                }
                query = allProducts.AsQueryable();
            }

            // 5. SORTING BY WEIGHT
            var sortedList = query.ToList();
            if (sortBy == "weight-low")
                sortedList = sortedList.OrderBy(p => ExtractWeightNumber(p.Weight)).ToList();
            else if (sortBy == "weight-high")
                sortedList = sortedList.OrderByDescending(p => ExtractWeightNumber(p.Weight)).ToList();
            else
                sortedList = sortedList.OrderBy(p => p.Id).ToList(); // Default

            // --- SMART TITLE LOGIC (UPDATED) ---
            if (sortedList.Any())
            {
                // If you have passed 'type' in the URL, we can treat that as the primary title first,
                // so that the exact title clicked by the user appears at the top!

                string displayTitle = type;

                // If the type contains "&metal=" or any extra parameters, clean them up
                if (displayTitle.Contains("&"))
                {
                    displayTitle = displayTitle.Split('&')[0];
                }

                // Logic to remove duplicate words again (such as "Gold Gold")
                string[] words = displayTitle.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                var cleanWords = new List<string>();

                foreach (var word in words)
                {
                    // Prevent duplicate words from being added repeatedly by doing a case-insensitive check
                    if (!cleanWords.Any(w => w.Equals(word, StringComparison.OrdinalIgnoreCase)))
                    {
                        cleanWords.Add(word);
                    }
                }

                ViewBag.CategoryType = string.Join(" ", cleanWords);
            }
            else
            {
                ViewBag.CategoryType = type;
            }

            // Store filter values in ViewBag so that the dropdown remains set on the UI
            ViewBag.CurrentMetal = metal;
            ViewBag.CurrentWeight = weight;
            ViewBag.CurrentSort = sortBy;
            ViewBag.CurrentType = type;

            // Passed 'sortedList' instead of 'products' here to prevent errors
            return View(sortedList);
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult AboutUs()
        {
            return View(); 
        }
        public IActionResult HowToEnquire()
        {
            return View();
        }
        public IActionResult ContactUs()
        {
            return View(); 
        }
        

        public IActionResult TrendingCollection(int id)
        {
            try
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == id);

                if (product == null)
                {
                    return NotFound("Product does not exist in database!");
                }

                return View(product);
            }
            catch (Exception ex)
            {
                return Content(" Error: " + ex.Message);
            }
        }

        public IActionResult Details(int id)
        {
            // Real DB - data fetch 
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            if (product == null) { return NotFound(); }

            // Here we have specified the exact path to the server so it uses the HTML from the Products folder
            return View("~/Views/Products/Details.cshtml", product);
        }

        public IActionResult TrendingList(string weight, string metalType)
        {
            try
            {
                var query = _context.Products.Where(p => p.Category == "Trending").AsQueryable();

                // 1. Apply Metal Type filter first
                if (!string.IsNullOrEmpty(metalType))
                {
                    query = query.Where(p => p.MetalType == metalType);
                }

                // Bring data into memory so we can easily convert string weight to decimal and filter
                var productsList = query.Select(p => new Product
                {
                    Id = p.Id,
                    Name = p.Name ?? "",
                    Category = p.Category ?? "",
                    SubCategory = p.SubCategory ?? "",
                    Gender = p.Gender ?? "Unisex",
                    ImageURL = p.ImageURL ?? "",
                    Weight = p.Weight ?? "",
                    Price = p.Price,
                    MetalType = p.MetalType ?? ""
                }).ToList();

                // 2. Weight Filter (In-Memory Check to avoid any SQL/String conversion errors)
                if (!string.IsNullOrEmpty(weight))
                {
                    productsList = productsList.Where(p => {
                        // Extract only numbers and decimal points from the weight string (e.g., "12.5 g" -> 12.5)
                        string rawWeight = p.Weight ?? "";
                        string cleanNumStr = new string(rawWeight.Where(c => char.IsDigit(c) || c == '.').ToArray());

                        if (decimal.TryParse(cleanNumStr, out decimal wVal))
                        {
                            if (weight == "0-5") return wVal >= 0 && wVal <= 5;
                            if (weight == "5-10") return wVal > 5 && wVal <= 10;
                            if (weight == "10-20") return wVal > 10 && wVal <= 20;
                            if (weight == "20+") return wVal > 20;
                        }
                        return false;
                    }).ToList();
                }

                return View(productsList);
            }
            catch (Exception ex)
            {
                return Content("Error details: " + ex.Message);
            }
        }

        public IActionResult Wishlist()
        {
            return View();
        }
        private decimal ExtractWeightNumber(string weightStr)
        {
            if (string.IsNullOrEmpty(weightStr)) return 0;
            string numStr = new string(weightStr.Where(c => char.IsDigit(c) || c == '.').ToArray());
            if (decimal.TryParse(numStr, out decimal result))
            {
                return result;
            }
            return 0;
        }

    }
}


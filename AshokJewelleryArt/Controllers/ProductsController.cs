using AshokJewelleryArt.Data;
using AshokJewelleryArt.Models; // Aapke Models ka sahi namespace
using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AshokJewelleryArt.Controllers
{
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;


        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string category, string subCategory, string searchString, String MetalType)
        {
            ViewBag.PageTitle = !string.IsNullOrEmpty(category) && !string.IsNullOrEmpty(subCategory)
                          ? $"{category} {subCategory}"
                          : (category ?? "Collection");
          

            try
            {
                string query = @"SELECT Id, 
                               IFNULL(Name, '') as Name, 
                               IFNULL(Category, '') as Category, 
                               IFNULL(SubCategory, '') as SubCategory, 
                               IFNULL(MetalType, '') as MetalType, 
                               IFNULL(MaterialType, '') as MaterialType,
                               IFNULL(Weight, '0') as Weight, 
                               IFNULL(WeightUnit, 'gm') as WeightUnit, 
                               IFNULL(Gender, 'Unisex') as Gender,
                               IFNULL(Price, 0) as Price, 
                               IFNULL(ImageURL, '/images/default.jpg') as ImageURL, 
                               IFNULL(Description, '') as Description, 
                               IsTrending, IsNewArrival, CreatedAt 
                        FROM Products WHERE 1=1";

                if (!string.IsNullOrEmpty(category))
                    if (category == "Studs-Tops")
                    {
                        // If 'Studs-Tops' comes from the mega menu, it will filter data for all three categories                        
                        query += " AND (Category IN ('Gold Tops', 'Silver Studs', 'Diamond Earrings'))";
                    }
                    else if (category.Contains(","))
                    {
                        var categoryList = category.Split(',')
                                                   .Select(c => $"'{c.Trim()}'");
                        string categoriesFormatted = string.Join(",", categoryList);

                        query += $" AND (Category IN ({categoriesFormatted}) OR SubCategory IN ({categoriesFormatted}))";
                    }
                    else if (category.Equals("Ring", StringComparison.OrdinalIgnoreCase) || category.Equals("Rings", StringComparison.OrdinalIgnoreCase))
                    {
                        query += " AND (Category LIKE '%Ring%' OR SubCategory LIKE '%Ring%' OR Name LIKE '%Ring%')";
                        query += " AND (Category NOT LIKE '%Earring%' AND Category NOT LIKE '%Toe%')";
                        query += " AND (SubCategory NOT LIKE '%Earring%' AND SubCategory NOT LIKE '%Toe%')";
                        query += " AND (Name NOT LIKE '%Earring%' AND Name NOT LIKE '%Toe Ring%' AND Name NOT LIKE '%Toe-Ring%')";
                    }
                    else
                    {
                        query += $" AND (Category = '{category}' OR Name LIKE '%{category}%' OR SubCategory = '{category}')";
                    }

                // 2. SUBCATEGORY FILTER (for Pendants aur Rings)
                if (!string.IsNullOrEmpty(subCategory))
                {
                    // 1. PENDANT SPECIAL FILTER
                    if (subCategory.Equals("Pendant", StringComparison.OrdinalIgnoreCase) || subCategory.Equals("Pendants", StringComparison.OrdinalIgnoreCase))
                    {
                        query += " AND (SubCategory LIKE '%Pendant%' OR Name LIKE '%Pendant%')";
                        query += " AND (SubCategory IS NULL OR (SubCategory NOT LIKE '%Mangalsutra%' AND SubCategory NOT LIKE '%Dorle%'))";
                        query += " AND Name NOT LIKE '%Mangalsutra%' AND Name NOT LIKE '%Dorle%'";
                    }
                    // 2. RING SPECIAL FILTER (Strict logic to avoid Earring & Toe Ring)
                    else if (subCategory.Equals("Ring", StringComparison.OrdinalIgnoreCase) || subCategory.Equals("Rings", StringComparison.OrdinalIgnoreCase))
                    {
                        // Sirf wahi items aayenge jinki SubCategory ya Name me strictly ring ho, par Earring ya Toe na ho
                        query += " AND (SubCategory = 'Ring' OR SubCategory = 'Rings' OR Name = 'Ring' OR Name LIKE '% Ring %' OR Name LIKE '% Ring' OR Name LIKE 'Ring %')";
                        query += " AND (SubCategory NOT LIKE '%Earring%' AND SubCategory NOT LIKE '%Toe%')";
                        query += " AND (Name NOT LIKE '%Earring%' AND Name NOT LIKE '%Toe Ring%' AND Name NOT LIKE '%Toe-Ring%')";
                    }
                    // 3. NORMAL SUBCATEGORY LOGIC
                    else
                    {
                        query += $" AND (SubCategory = '{subCategory}' OR Name LIKE '%{subCategory}%')";
                    }
                }

                if (!string.IsNullOrEmpty(MetalType))
                {
                    query += $" AND (MetalType = '{MetalType}')";
                }

                // Search logic
                if (!string.IsNullOrEmpty(searchString))
                {
                    query += $" AND (Name LIKE '%{searchString}%' OR Category LIKE '%{searchString}%')";
                }

                // EF Products fetch 
                var filteredProducts = await _context.Products
                    .FromSqlRaw(query)
                    .AsNoTracking()
                    .ToListAsync();

                return View("IndexPR", filteredProducts);
            }
            catch (Exception ex)
            {
                return Content("Error : " + ex.Message);
            }
        }


        [HttpGet]
        [Route("Product/Details/{id}")]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            try
            {
                // Added MetalType to the query to avoid the Unknown Column error
                var product = await _context.Products
                    .FromSqlRaw(@"SELECT Id, 
                                IFNULL(Name, '') as Name, 
                                IFNULL(MaterialType, '') as MaterialType,
                                IFNULL(MetalType, '') as MetalType,  -- YE LINE ADD KI HAI
                                IFNULL(Category, '') as Category, 
                                IFNULL(SubCategory, '') as SubCategory, 
                                IFNULL(Weight, '0') as Weight, 
                                IFNULL(WeightUnit, 'gm') as WeightUnit, 
                                IFNULL(Gender, 'Unisex') as Gender,
                                IFNULL(Price, 0) as Price, 
                                IFNULL(ImageURL, '/images/default.jpg') as ImageURL, 
                                IFNULL(Description, '') as Description, 
                                IsTrending, IsNewArrival, CreatedAt 
                         FROM Products 
                         WHERE Id = {0}", id)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound();
                }

                return View(product);
            }
            catch (Exception ex)
            {
                // Now a detailed message will be shown if any issue still remains
                return Content("Hey, details are not loading: " + ex.Message);
            }
        }

        
        public IActionResult BridalCollection()
        {
            try
            {
                var bridalItems = _context.Products
                    .FromSqlRaw(@"SELECT Id, 
                                 IFNULL(Name, '') as Name, 
                                 IFNULL(MaterialType, '') as MaterialType,
                                 IFNULL(MetalType, '') as MetalType,
                                 IFNULL(Category, '') as Category, 
                                 IFNULL(SubCategory, '') as SubCategory, 
                                 IFNULL(Weight, '0') as Weight, 
                                 IFNULL(WeightUnit, 'gm') as WeightUnit, 
                                 IFNULL(Gender, 'Unisex') as Gender,
                                 IFNULL(Price, 0) as Price, 
                                 IFNULL(ImageURL, '/images/default.jpg') as ImageURL, 
                                 IFNULL(Description, '') as Description,
                                 IsTrending, IsNewArrival, CreatedAt
                          FROM Products 
                          WHERE Name LIKE '%Bridal%' OR Category LIKE '%Bridal%'")
                    .ToList();

                return View("BridalPage", bridalItems);
            }
            catch (Exception ex)
            {
                return Content(" Error : " + ex.Message);
            }
        }


    }
}
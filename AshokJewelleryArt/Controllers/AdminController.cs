using AshokJewelleryArt.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;  
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic; 
using System.Data; 
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;


namespace AshokJewelleryArt.Controllers
{
    public class AdminController : Controller
    {
        // 1. Yeh do lines class ke andar sabse upar likhein
        private readonly IConfiguration _configuration;
        private readonly string connectionString;

        // 2. Yeh constructor banayein
        public AdminController(IConfiguration configuration)
        {
            _configuration = configuration;
            connectionString = _configuration.GetConnectionString("DefaultConnection") ?? "";
        }
        // 1. Updated Index Method: Security Check + Data Load
        public IActionResult Index()
        {
            // --- SECURITY GUARD START ---
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminUser")))
            {
                return RedirectToAction("Login", "Admin");
            }
            // --- SECURITY GUARD END ---
            
            //-----starts visitors code------//
            string totalVisitors = "0";
            string topLocation = "No Data";

            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    con.Open();

                    // 1. Total Visitors .. count 
                    string countQuery = "SELECT COUNT(Id) FROM VisitorLogs";
                    using (MySqlCommand cmd = new MySqlCommand(countQuery, con))
                    {
                        var countObj = cmd.ExecuteScalar();
                        if (countObj != null)
                        {
                            totalVisitors = Convert.ToInt32(countObj).ToString("#,##0");
                        }
                    }

                    // 2. Top Location 
                    string locationQuery = "SELECT Location FROM VisitorLogs GROUP BY Location ORDER BY COUNT(Id) DESC LIMIT 1";
                    using (MySqlCommand cmd = new MySqlCommand(locationQuery, con))
                    {
                        var locObj = cmd.ExecuteScalar();
                        if (locObj != null)
                        {
                            topLocation = locObj.ToString();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                totalVisitors = "0";
                topLocation = "Error";
                System.Diagnostics.Debug.WriteLine("Admin Data Error: " + ex.Message);
            }

            // in sidebar,-data  print
            ViewBag.TotalVisitors = totalVisitors;
            ViewBag.TopLocation = topLocation;

            List<Dictionary<string, string>> allLocations = new List<Dictionary<string, string>>();
            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    con.Open();
                    string allLocQuery = "SELECT IpAddress, Location, DATE_FORMAT(VisitDate, '%d-%m-%Y %h:%i %p') as FormattedDate FROM VisitorLogs ORDER BY Id DESC";
                    using (MySqlCommand cmd = new MySqlCommand(allLocQuery, con))
                    {
                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var row = new Dictionary<string, string>
                    {
                        { "Ip", reader["IpAddress"].ToString() },
                        { "Loc", reader["Location"].ToString() },
                        { "Date", reader["FormattedDate"].ToString() }
                    };
                                allLocations.Add(row);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("All Locations Fetch Error: " + ex.Message);
            }

            //Stored the entire list in ViewBag so that HTML can access it
            ViewBag.AllLocationsList = allLocations;
            //---------end visitors code-------------//

            DataTable dt = new DataTable();
            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    string query = "SELECT * FROM Products ORDER BY Id DESC";
                    using (MySqlCommand cmd = new MySqlCommand(query, con))
                    {
                        con.Open();
                        using (MySqlDataAdapter sda = new MySqlDataAdapter(cmd))
                        {
                            sda.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ViewBag.Error = "Data couldn't load.: " + ex.Message;
            }

            return View("IndexAD", dt);
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View(); 
        }

        

        [HttpPost]
        public IActionResult Login(string username, string password)
        {
            using (MySqlConnection con = new MySqlConnection(connectionString))
            {
                string query = "SELECT COUNT(*) FROM AdminUsers WHERE Username = @user AND Password = @pass";
                MySqlCommand cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@user", username);
                cmd.Parameters.AddWithValue("@pass", password);

                con.Open();

                int count = Convert.ToInt32(cmd.ExecuteScalar());

                if (count > 0)
                {
                    HttpContext.Session.SetString("AdminUser", username);

                    // Cookie logic (1 day)
                    CookieOptions options = new CookieOptions
                    {
                        Expires = DateTime.Now.AddDays(1),
                        HttpOnly = true,
                        IsEssential = true
                    };
                    Response.Cookies.Append("AdminLoginCookie", username, options);

                    // --- SUCCESS MESSAGE  ---//
                    TempData["LoginSuccess"] = "Welcome back! Login Successful.";
                   

                    return RedirectToAction("Index");
                }
                else
                {
                    ViewBag.Error = "Invalid ID or Password!";
                    return View();
                }
            }
        }
        // 2. AddProduct Method: add products to inventory
        [HttpPost]
        public async Task<IActionResult> AddProduct(
      string pName,
      string pCategory,
      string pSubCategory,
      string MaterialType,
      string pWeight,
      string pWeightUnit,
      string pGender,
      decimal pPrice,
      string pMetalType,
      int isTrending,
      int isNewArrival,
      int isBridal, // <--- new Parameter
      string pDescription,
      IFormFile imgInput)
        {
            try
            {
                string? imagePath = null;
                if (imgInput != null)
                {
                    string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(wwwrootPath)) Directory.CreateDirectory(wwwrootPath);

                    string fileName = Path.GetFileName(imgInput.FileName);
                    string fullPath = Path.Combine(wwwrootPath, fileName);

                    // AGAR FILE PEHLE SE HAI: Toh naya copy mat banao, purani wali hi use karo!
                    if (!System.IO.File.Exists(fullPath))
                    {
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await imgInput.CopyToAsync(stream);
                        }
                    }

                    imagePath = "/images/" + fileName;
                }

                long generatedId = 0;

                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    string query = @"INSERT INTO Products (Name, Category, SubCategory, MaterialType, Weight, WeightUnit, Gender, Price, ImageURL, IsTrending, IsNewArrival, IsBridal, Description, MetalType, CreatedAt) 
                                  VALUES (@name, @cat, @subCat, @matType, @weight, @unit, @gender, @price, @img, @trending, @new, @bridal, @desc, @metal, @date);
                                  SELECT LAST_INSERT_ID();";

                    using (MySqlCommand cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@name", pName ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@cat", pCategory ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@subCat", pSubCategory ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@matType", MaterialType ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@weight", pWeight ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@unit", pWeightUnit ?? "gm");
                        cmd.Parameters.AddWithValue("@gender", pGender ?? "Unisex");
                        cmd.Parameters.AddWithValue("@price", pPrice);
                        cmd.Parameters.AddWithValue("@img", imagePath ?? "/images/default.jpg");
                        cmd.Parameters.AddWithValue("@trending", isTrending);
                        cmd.Parameters.AddWithValue("@new", isNewArrival);
                        cmd.Parameters.AddWithValue("@bridal", isBridal);
                        cmd.Parameters.AddWithValue("@desc", pDescription ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@metal", pMetalType ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@date", DateTime.Now);

                        con.Open();
                        // ExecuteScalar se insert bhi ho jayega aur nayi ID bhi mil jayegi
                        object result = cmd.ExecuteScalar();
                        if (result != null)
                        {
                            generatedId = Convert.ToInt64(result);
                        }
                    }
                }

                return Json(new { success = true, id = generatedId, message = "Product Saved with Bridal Status! ✔" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = " error: " + ex.Message });
            }
        }
        // for admin setting now->


        [HttpPost]
        public IActionResult UpdateSettings([FromBody] AshokJewelleryArt.Models.AdminSettingsViewModel model)
        {
            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    con.Open();

                    // 1. Password check (ID = 1 ya jo bhi pehla row ho)
                    string checkQuery = "SELECT password FROM AdminUsers ORDER BY id ASC LIMIT 1";
                    using (MySqlCommand cmd = new MySqlCommand(checkQuery, con))
                    {
                        object dbPassword = cmd.ExecuteScalar();
                        if (dbPassword == null || dbPassword.ToString() != model.OldPassword)
                        {
                            return Json(new { success = false, message = "Purana password sahi nahi hai!" });
                        }
                    }

                    // 2. Update logic (Username aur Password update karna)
                    string updateQuery = "UPDATE AdminUsers SET username = @user, password = @pass ORDER BY id ASC LIMIT 1";
                    using (MySqlCommand updateCmd = new MySqlCommand(updateQuery, con))
                    {
                        updateCmd.Parameters.AddWithValue("@user", model.NewUsername);
                        updateCmd.Parameters.AddWithValue("@pass", model.NewPassword);
                        updateCmd.ExecuteNonQuery();
                    }
                }
                return Json(new { success = true, message = "Settings successfully save ho gayi!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error: " + ex.Message });
            }
        }

        [HttpPost]
        public IActionResult CreateAdmin([FromBody] AshokJewelleryArt.Models.AdminSettingsViewModel model)
        {
            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    con.Open();

                    // STEP A: First check if the table is empty or not?
                    string checkCount = "SELECT COUNT(*) FROM AdminUsers";
                    MySqlCommand cmdCount = new MySqlCommand(checkCount, con);
                    int adminExists = Convert.ToInt32(cmdCount.ExecuteScalar());

                    // If there is already 1 admin, do not allow a new one to be created.
                    if (adminExists >= 1)
                    {
                        return Json(new { success = false, message = "Admin account already exists! You can only update it." });
                    }

                    // STEP B: If there is no admin, only then insert.
                    string query = "INSERT INTO AdminUsers (id, username, password) VALUES (1, @user, @pass)";
                    using (MySqlCommand cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@user", model.NewUsername);
                        cmd.Parameters.AddWithValue("@pass", model.NewPassword);
                        cmd.ExecuteNonQuery();
                    }
                }
                return Json(new { success = true, message = "Congratulations ! Admin account Created Successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Duplicate or Error: " + ex.Message });
            }
        }


        private void SendSecurityAlert(string attemptedUser)
        {
            try
            {
                var sender = _configuration["EmailSettings:SenderEmail"] ?? "";
                var password = _configuration["EmailSettings:AppPassword"] ?? "";
                var adminTo = _configuration["EmailSettings:AdminEmail"] ?? "";

                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.Credentials = new NetworkCredential(sender, password);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(sender, "Ashok Jewellery Security"),
                        Subject = "⚠️ ALERT: Unauthorized Access Attempt",
                        IsBodyHtml = true
                    };

                    // Writing the string on a single line will remove the green squiggly lines (warnings)
                    string alertBody = "<h3>Security Alert!</h3><p>An unauthorized login attempt was detected on your Admin Panel.</p><hr/>";
                    alertBody += "<b>Attempted Username:</b> " + attemptedUser + "<br/>";
                    alertBody += "<b>Date & Time:</b> " + DateTime.Now.ToString("dd MMM yyyy, hh:mm tt") + "<hr/>";
                    alertBody += "<p>Please check your database security immediately.</p>";

                    mailMessage.Body = alertBody;
                    mailMessage.To.Add(adminTo);
                    client.Send(mailMessage);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine("Email Error: " + ex.Message);

            }
        }

        [HttpPost]
        [IgnoreAntiforgeryToken]
        public IActionResult DeleteInventory(int id)
        {
            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    string query = "DELETE FROM Products WHERE Id = @id";
                    using (MySqlCommand cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        con.Open();
                        int rows = cmd.ExecuteNonQuery();

                        if (rows > 0)
                        {
                            return Ok();
                        }
                        else
                        {
                            return NotFound();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> UpdateProduct(
            int id, string name, string weight, string WeightUnit, string pGender, decimal price, string metalType, string category,
            string MaterialType, string pSubCategory, string Description, int isTrending, int isNewArrival, int isBridal,
            IFormFile? updateImg)
        {
            try
            {
                string? imagePath = null;
                if (updateImg != null)
                {
                    string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                    if (!Directory.Exists(wwwrootPath)) Directory.CreateDirectory(wwwrootPath);

                    string fileName = Path.GetFileName(updateImg.FileName);
                    string fullPath = Path.Combine(wwwrootPath, fileName);

                    if (!System.IO.File.Exists(fullPath))
                    {
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await updateImg.CopyToAsync(stream);
                        }
                    }

                    imagePath = "/images/" + fileName;
                }

                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    // QUERY UPDATE: all new flags and SubCategory - includeed
                    string query = @"UPDATE Products SET 
                            Name = @name, 
                            Weight = @weight, 
                            WeightUnit=@weightunit,
                            Gender=@gender,
                            Price = @price, 
                            MetalType = @metal, 
                            Category = @category, 
                            MaterialType = @matType, 
                            SubCategory = @subCat,
                            Description=@description,
                            IsTrending = @trending,
                            IsNewArrival = @new,
                            IsBridal = @bridal" +
                                    (imagePath != null ? ", ImageURL = @img " : " ") +
                                    " WHERE Id = @id";

                    using (MySqlCommand cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        cmd.Parameters.AddWithValue("@name", name);
                        cmd.Parameters.AddWithValue("@weight", weight);
                        cmd.Parameters.AddWithValue("@weightunit", WeightUnit);
                        cmd.Parameters.AddWithValue("@gender", pGender ?? "Unisex");
                        cmd.Parameters.AddWithValue("@price", price);
                        cmd.Parameters.AddWithValue("@metal", metalType ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@category", category ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@matType", MaterialType ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@subCat", pSubCategory ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@description", Description);
                        cmd.Parameters.AddWithValue("@trending", isTrending);
                        cmd.Parameters.AddWithValue("@new", isNewArrival);
                        cmd.Parameters.AddWithValue("@bridal", isBridal);

                        if (imagePath != null) cmd.Parameters.AddWithValue("@img", imagePath);

                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Json(new { success = true, message = "Update Successful!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Database Error: " + ex.Message });
            }
        }
        public class SingleProductViewModel
        {
            public string Weight { get; set; } // 'W' Capital
            public string MaterialType { get; set; }
            public decimal MarketRate { get; set; }
            public decimal EstimatedPrice { get; set; } // Price ki jagah ye
            public IFormFile ProductImage { get; set; }
        }

        public class BulkUploadViewModel
        {
            public string Collection { get; set; }
            public string MetalType { get; set; }
            public string ProductTitle { get; set; }
            public string Gender { get; set; }
            public List<SingleProductViewModel> Products { get; set; } = new List<SingleProductViewModel>();
        }


        [HttpPost]
        public async Task<JsonResult> UploadBulkProducts([FromForm] BulkUploadViewModel model)
        {
            if (model?.Products == null || !model.Products.Any())
            {
                return Json(new { success = false, message = "System received empty data!" });
            }

            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    con.Open();
                    foreach (var item in model.Products)
                    {
                        string imagePath = "/images/default.jpg";
                        if (item.ProductImage != null)
                        {
                            
                                string wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                                if (!Directory.Exists(wwwrootPath)) Directory.CreateDirectory(wwwrootPath);

                                string fileName = Path.GetFileName(item.ProductImage.FileName);
                                string fullPath = Path.Combine(wwwrootPath, fileName);

                                if (!System.IO.File.Exists(fullPath))
                                {
                                    using (var stream = new FileStream(fullPath, FileMode.Create))
                                    {
                                        await item.ProductImage.CopyToAsync(stream);
                                    }
                                }

                                imagePath = "/images/" + fileName;
                            }

                            string query = @"INSERT INTO Products 
                                (Name, Category, MaterialType, Weight, WeightUnit, Gender, Price, ImageURL, IsTrending, IsNewArrival, MetalType, CreatedAt) 
                                VALUES 
                                (@name, @cat, @matType, @weight, @unit, @gender, @price, @img, @trending, @new, @metal, @date)";

                        using (MySqlCommand cmd = new MySqlCommand(query, con))
                        {
                            cmd.Parameters.AddWithValue("@name", model.ProductTitle ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@cat", model.Collection ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@matType", item.MaterialType ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@weight", item.Weight ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@unit", "gm");
                            cmd.Parameters.AddWithValue("@gender", model.Gender ?? "Unisex");
                            cmd.Parameters.AddWithValue("@price", item.EstimatedPrice);
                            cmd.Parameters.AddWithValue("@img", imagePath);
                            cmd.Parameters.AddWithValue("@trending", (model.Collection == "Trending" ? 1 : 0));
                            cmd.Parameters.AddWithValue("@new", (model.Collection == "New Arrival" ? 1 : 0));
                            cmd.Parameters.AddWithValue("@metal", model.MetalType ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@date", DateTime.Now);

                            cmd.ExecuteNonQuery();
                        }
                    }
                }
                return Json(new { success = true, message = "Badhai ho! All products saved to Ashok Jewellery DB." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Bhai Error: " + ex.Message });
            }
        }

       
       
        public IActionResult AdminPanel()
        {
            // --- SECURITY GUARD START ---
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AdminUser")))
            {
                return RedirectToAction("Login", "Admin");
            }
            // --- SECURITY GUARD END ---

            string totalVisitors = "0";
            string topLocation = "No Data";

            try
            {
                using (MySqlConnection con = new MySqlConnection(connectionString))
                {
                    con.Open();

                    // 1. Total Visitors  count
                    string countQuery = "SELECT COUNT(Id) FROM VisitorLogs";
                    using (MySqlCommand cmd = new MySqlCommand(countQuery, con))
                    {
                        var countObj = cmd.ExecuteScalar();
                        if (countObj != null)
                        {
                            totalVisitors = Convert.ToInt32(countObj).ToString("#,##0");
                        }
                    }

                    // 2. Top Location 
                    string locationQuery = "SELECT Location FROM VisitorLogs GROUP BY Location ORDER BY COUNT(Id) DESC LIMIT 1";
                    using (MySqlCommand cmd = new MySqlCommand(locationQuery, con))
                    {
                        var locObj = cmd.ExecuteScalar();
                        if (locObj != null)
                        {
                            topLocation = locObj.ToString();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                totalVisitors = "Error";
                topLocation = ex.Message;
            }

           
            ViewBag.TotalVisitors = totalVisitors;
            ViewBag.TopLocation = topLocation;

            // Aapka dashboard view return
            return View("IndexAD");
        }

        [HttpGet]
        public async Task<IActionResult> GetMetalRates()
        {
            string apiKey = _configuration["ApiSettings:MetalApiKey"] ?? "";
            string targetUrl = $"https://api.metalapi.com/v1/latest?api_key={apiKey}&base=USD&currencies=INR,XAU,XAG";

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync(targetUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        string data = await response.Content.ReadAsStringAsync();
                        return Content(data, "application/json");
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { error = ex.Message });
                }
            }

            return BadRequest(new { message = "Failed to fetch rates" });
        }
    }
}



using AshokJewelleryArt.Data; // Is line ko check karein
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
// Session service ko add karein
builder.Services.AddDistributedMemoryCache(); // Ye session data store karne ke liye zaroori hai
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromDays(1); // 7 din tak login rahega!
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.MaxAge = TimeSpan.FromDays(1); // Ye browser ko bolega ki cookie delete mat karo
});

builder.Services.AddHttpContextAccessor(); // Controllers mein session access karne ke liye

// --- DATABASE CONNECTION SERVICE (Ye builder.Build se pehle hona chahiye) ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("Connection string missing! Check appsettings.json.");
}
Console.WriteLine("Connection String found: " + connectionString);


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
// ----------------------------------------------------------------------------

builder.Services.AddControllersWithViews();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
// Static Files with Custom MIME Types
var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".mp4"] = "video/mp4"; // MP4 format strictly allow kiya

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});
app.UseRouting();    // 2. Routing (Sirf EK baar)

app.UseSession();    // 3. Session (Routing ke turant baad)

app.UseAuthorization(); // 4. Authorization (Session ke baad)

// Map routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
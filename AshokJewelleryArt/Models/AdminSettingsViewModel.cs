using System.ComponentModel.DataAnnotations;

namespace AshokJewelleryArt.Models
{
    public class AdminSettingsViewModel
    {
        public string NewUsername { get; set; }

        [Required]
        public string OldPassword { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }

        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; }
    }
}

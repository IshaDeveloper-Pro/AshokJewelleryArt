/*
 * Trending Collection Click Handler
 * Handles redirection from Home Page to Details Page
 */

document.addEventListener("DOMContentLoaded", function () {

    // 1. Saare premium cards  select 
    const premiumCards = document.querySelectorAll('.premium-card');

    premiumCards.forEach(card => {
        // Card  click event 
        card.addEventListener('click', function () {

            // 'data-item' attribute - value  (e.g., Ring, Earrings)
            const itemType = this.getAttribute('data-item');

            if (itemType) {
                // Redirect to the detail page with the query string
                window.location.href = `/Home/TrendingCollection?item=${itemType}`;
            } else {
                console.warn("Item type missing on this card!");
            }
        });

        // Hover effect visually check (Optional)
        card.addEventListener('mouseenter', () => {
            card.style.transform = "translateY(-5px)";
            card.style.transition = "0.3s ease";
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = "translateY(0)";
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {

    // --- 1. REDIRECTION LOGIC ---
    const premiumCards = document.querySelectorAll('.premium-card');
    premiumCards.forEach(card => {
        card.addEventListener('click', function () {
            const itemType = this.getAttribute('data-item');
            if (itemType) {
                window.location.href = `/Home/TrendingCollection?item=${itemType}`;
            }
        });

        // Hover Effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = "translateY(-5px)";
            card.style.transition = "0.3s ease";
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = "translateY(0)";
        });
    });

    // --- 2. ZOOM EFFECT LOGIC ---
    const zoomContainer = document.getElementById('js-zoom-container');
    const mainImage = document.getElementById('js-main-img');

    if (zoomContainer && mainImage) {
        zoomContainer.addEventListener('mousemove', function (e) {
            const { left, top, width, height } = zoomContainer.getBoundingClientRect();

            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;

            zoomContainer.style.cursor = 'zoom-out';
            mainImage.style.transformOrigin = `${x}% ${y}%`;
            mainImage.style.transform = "scale(1.8)";
        });

        zoomContainer.addEventListener('mouseleave', function () {
            mainImage.style.transform = "scale(1)";
            mainImage.style.transformOrigin = "center center";
            zoomContainer.style.cursor = 'zoom-in';
        });
    }
}); 

// --- 3. SCROLL LOGIC  ---
window.addEventListener('load', function () {
    if (window.location.hash === '#trending-section-target') {
        const element = document.getElementById('trending-section-target');
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
});
//now  foe wishlist-->

document.addEventListener('DOMContentLoaded', function () {
    const wishBtn = document.querySelector('.wish-icon-trending');
    if (!wishBtn) return;

    const productId = wishBtn.dataset.id;
    const icon = wishBtn.querySelector('i');

    let wishlist = JSON.parse(localStorage.getItem('userWishlist')) || [];

    // Check if ID exists in the objects array
    if (wishlist.some(item => item.id == productId)) {
        icon.classList.replace('fa-regular', 'fa-solid');
        icon.style.color = 'red';
    }

    // 3. Click Event for Toggle
    wishBtn.addEventListener('click', function () {
        wishlist = JSON.parse(localStorage.getItem('userWishlist')) || [];
        const index = wishlist.findIndex(item => item.id == productId);

        if (index === -1) {
            // making product object 
            const product = {
                id: wishBtn.dataset.id,
                name: wishBtn.dataset.name,
                image: wishBtn.dataset.image,
                weight: wishBtn.dataset.weight
            };
            wishlist.push(product);
            icon.classList.replace('fa-regular', 'fa-solid');
            icon.style.color = 'red';
        } else {
            wishlist.splice(index, 1);
            icon.classList.replace('fa-solid', 'fa-regular');
            icon.style.color = '';
        }

        // Save back to localStorage
        localStorage.setItem('userWishlist', JSON.stringify(wishlist));

        // Layout file -global function call karein count update
        if (typeof updateWishlistCount === "function") {
            updateWishlistCount();
        }
    });
});
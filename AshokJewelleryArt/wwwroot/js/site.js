// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification //
// for details on configuring this project to bundle and minify static web assets.//

//Hamburger Icon Toggle Script//

document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const closeBtn = document.getElementById("mobile-menu-close");
    const drawer = document.getElementById("newstyleDrawer");
    const overlay = document.getElementById("newstyleOverlay");

    // Open Drawer
    if (toggleBtn) {
        toggleBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (drawer) drawer.classList.add("active");
            if (overlay) overlay.classList.add("active");
        });
    }

    // Close Drawer Function
    function closeDrawer() {
        if (drawer) drawer.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    }

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);
});


//HERO BANNER SLIDER//
{
    let currentIndex = 0;
    const totalSlides = 5;
    const sliderContainer = document.querySelector('.slider-container');

    // Function to move slides
    function moveSlide(direction) {
        currentIndex += direction;

        // Loop logic
        if (currentIndex >= totalSlides) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = totalSlides - 1;
        }

        updateSlider();
        resetTimer();
    }

    function updateSlider() {
        if (typeof sliderContainer === 'undefined' || !sliderContainer) return;

        // 2. Calculation logic
        const offset = -currentIndex * 20;
        sliderContainer.style.transform = `translateX(${offset}%)`;

        // 3. Dots check 
        const dots = document.querySelectorAll('.dot');
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }
    }
    function currentSlide(index) {
        currentIndex = index;
        updateSlider();
        resetTimer();
    }

    // --- Auto-Play Logic ---
    let autoSlideTimer = setInterval(() => moveSlide(1), 5000);
    function resetTimer() {
        clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(() => moveSlide(1), 5000);
    }
}

/*gold silver section*/

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const rawType = urlParams.get('type') || urlParams.get('selectedCat');

    if (rawType) {

    }
});


document.querySelectorAll('.exclusive-collection a.geo-shape').forEach(function (link) {
    link.addEventListener('click', function () {
        const section = this.closest('.exclusive-collection');
        if (section) {
            const container = section.querySelector('.horizontal-scroll');
            if (container) {
                sessionStorage.setItem('targetContainer', container.id); // 'goldScroll' ya 'silverScroll' save ho jayega
                const rawType = this.getAttribute('href');
                sessionStorage.setItem('targetCat', rawType);
            }
        }
    });
});


window.addEventListener("load", function () {
    const targetContainerId = sessionStorage.getItem('targetContainer');
    const targetType = sessionStorage.getItem('targetCat');

    if (!targetContainerId || !targetType) return;

    var container = document.getElementById(targetContainerId);
    if (!container) return;

    var items = container.querySelectorAll('a.geo-shape');

    items.forEach(function (item) {
        var href = item.getAttribute('href') || "";

        if (targetType.includes(href) || href.includes(targetType.split('=')[1] || '')) {

            if (item.classList.contains('extra-item')) {
                container.classList.add('show-extra');
                container.classList.add('enable-scroll');

                var viewMoreCard = container.querySelector('.view-more-card');
                if (viewMoreCard) {
                    viewMoreCard.style.setProperty('display', 'none', 'important');
                }

                var centerBtnId = targetContainerId === 'goldScroll' ? 'goldCenterBackBtn' : 'silverCenterBackBtn';
                var bottomCenterBtn = document.getElementById(centerBtnId);
                if (bottomCenterBtn) {
                    bottomCenterBtn.style.setProperty('display', 'inline-flex', 'important');
                    bottomCenterBtn.style.opacity = "1";
                }
            }

            setTimeout(() => {
                if (item.classList.contains('extra-item')) {
                    container.classList.add('show-extra');
                    container.classList.add('enable-scroll');
                    var viewMoreCard = container.querySelector('.view-more-card');
                    if (viewMoreCard) {
                        viewMoreCard.style.setProperty('display', 'none', 'important');
                    }
                }

                if (window.innerWidth <= 425) {
                    setTimeout(() => {
                        item.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 200);
                } else {
                    var section = container.closest('section');
                    if (section) {
                        section.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }

                    var scrollPos = item.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (item.clientWidth / 2);
                    container.scrollTo({
                        left: scrollPos,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    });

    // Clear storage after action
    sessionStorage.removeItem('targetContainer');
    sessionStorage.removeItem('targetCat');
});




document.addEventListener("DOMContentLoaded", function () {
    var containers = ['goldScroll', 'silverScroll'];

    containers.forEach(function (id) {
        var container = document.getElementById(id);
        if (container) {
            // CSS force-apply
            container.style.overflowX = "hidden";
        }
    });
});



/*gold silver section - UPDATED WITH SCROLL ENABLE LOGIC*/
function sideScroll(elementId, direction) {
    var container = document.getElementById(elementId);
    if (!container) return;

    var viewBtn = container.querySelector('.view-more-card');
    var centerBtnId = elementId === 'goldScroll' ? 'goldCenterBackBtn' : 'silverCenterBackBtn';
    var bottomCenterBtn = document.getElementById(centerBtnId);

    if (direction === 'right') {
        container.classList.add('show-extra');
        container.classList.add('enable-scroll');

        if (viewBtn) viewBtn.classList.add('hide-view-more');

        if (bottomCenterBtn) {
            bottomCenterBtn.style.setProperty('display', 'inline-flex', 'important');
            bottomCenterBtn.style.opacity = "1";
        }

        container.scrollBy({ left: 400, behavior: 'smooth' });

        setTimeout(() => {
            if (viewBtn) {
                viewBtn.style.setProperty('display', 'none', 'important');
                viewBtn.style.width = '0px';
                viewBtn.style.minWidth = '0px';
                viewBtn.style.maxWidth = '0px';
                viewBtn.style.margin = '0px';
                viewBtn.style.padding = '0px';
            }
        }, 150);

    } else if (direction === 'left') {
        if (bottomCenterBtn) {
            bottomCenterBtn.style.opacity = "0";
            bottomCenterBtn.style.display = "none";
        }

        container.scrollTo({ left: 0, behavior: 'smooth' });

        setTimeout(() => {
            container.classList.remove('show-extra');
            container.classList.remove('enable-scroll');
            if (viewBtn) {
                viewBtn.classList.remove('hide-view-more');
                viewBtn.style.removeProperty('display');
                viewBtn.style.removeProperty('width');
                viewBtn.style.removeProperty('min-width');
                viewBtn.style.removeProperty('max-width');
                viewBtn.style.removeProperty('margin');
                viewBtn.style.removeProperty('padding');
            }
        }, 500);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var containers = ['goldScroll', 'silverScroll'];
    containers.forEach(function (id) {
        var container = document.getElementById(id);
        if (container) {
            container.addEventListener('scroll', function () {
                if (!container.classList.contains('show-extra')) {
                    container.scrollLeft = 0;
                }
            });
        }
    });
});


// ==========================================
// PURE SCROLL BLOCKER & MONITOR FIX
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    function setupScrollBlocker(id) {
        var container = document.getElementById(id);
        if (!container) return;

        container.addEventListener('scroll', function (e) {
            if (!container.classList.contains('enable-scroll')) {
                container.scrollLeft = 0;
            }
        });
    }

    setupScrollBlocker('goldScroll');
    setupScrollBlocker('silverScroll');

    // Monitor scroll logic -//
    function monitorScroll(scrollContainerId, centerBtnId) {
        var container = document.getElementById(scrollContainerId);
        var bottomCenterBtn = document.getElementById(centerBtnId);
        if (!container || !bottomCenterBtn) return;

        container.addEventListener('scroll', function () {
            if (!container.classList.contains('enable-scroll')) {
                bottomCenterBtn.style.display = 'none';
                return;
            }
            var maxScrollLeft = container.scrollWidth - container.clientWidth;
            var currentScroll = Math.ceil(container.scrollLeft);

            if (currentScroll <= 10) {
                bottomCenterBtn.style.opacity = "0";
                bottomCenterBtn.style.display = "none";
            } else if (maxScrollLeft - currentScroll <= 50) {
                bottomCenterBtn.style.opacity = "0";
                bottomCenterBtn.style.display = "none";
            } else {
                bottomCenterBtn.style.display = "inline-flex";
                bottomCenterBtn.style.opacity = "1";
            }
        });
    }

    monitorScroll('goldScroll', 'goldCenterBackBtn');
    monitorScroll('silverScroll', 'silverCenterBackBtn');
});


//---------------------------DIAMOND AND GEMSTONE SECTION--------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCat = urlParams.get('selectedCat');

    if (selectedCat) {
        let targetId = '';

        if (selectedCat.startsWith("Silver")) {
            targetId = 'silverScroll';
        } else if (selectedCat.startsWith("Gold")) {
            targetId = 'goldScroll';
        } else if (selectedCat.startsWith("Diamond")) {
            targetId = 'diamondScroll';
        } else if (selectedCat.startsWith("Gemstone") || selectedCat.startsWith("Emerald")) {
            targetId = 'gemstoneScroll';
        }

        if (targetId) {
            setTimeout(() => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 300);
        }

        window.history.replaceState({}, document.title, window.location.pathname);
    }
});


/*----------------------------New arrival section----------------------*/

//  NEW ARRIVAL SECTION (With Unique Timer Names)//

function moveSlider(direction) {
    const wrapper = document.getElementById('newArrivals');
    if (!wrapper) return;

    const productCol = wrapper.querySelector('.product-col');
    if (!productCol) return;

    const cardWidth = productCol.offsetWidth + 25;

    const currentScroll = wrapper.scrollLeft;
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

    if (direction === 1) { // Next Click
        if (currentScroll >= (maxScroll - 10)) {
            wrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    } else { // Prev Click
        if (currentScroll <= 10) {
            wrapper.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
            wrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
    }

    resetNewArrivalsTimer();
}

window.newArrivalsInterval = window.newArrivalsInterval || setInterval(function () {
    moveSlider(1);
}, 7000);

function resetNewArrivalsTimer() {
    clearInterval(window.newArrivalsInterval);
    window.newArrivalsInterval = setInterval(function () {
        moveSlider(1);
    }, 7000);
}
function toggleFilterMenu() {
    var menu = document.getElementById("filterMenu");
    menu.classList.toggle("show-menu");
}

window.onclick = function (event) {
    if (!event.target.matches('.main-filter-btn')) {
        var dropdowns = document.getElementsByClassName("filter-list-dropdown");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show-menu')) {
                openDropdown.classList.remove('show-menu');
            }
        }
    }
}
// --- 1. FILTER DRAWER SECTION ---
function toggleAjFilter() {
    const drawer = document.getElementById("ajSidePanel");
    const overlay = document.getElementById("ajGlassOverlay");

    if (drawer && overlay) {
        drawer.classList.toggle("aj-drawer-active");
        overlay.classList.toggle("aj-overlay-active");

        if (drawer.classList.contains("aj-drawer-active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }
}

// --- 2. TRENDING SLIDER SECTION ---
function initTrendingSlider() {
    const slider = document.getElementById('trenndingsliders');
    let scrollAmount = 0;

    if (!slider) return;

    function autoScroll() {
        const cardWidth = 410;
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (scrollAmount >= maxScroll) {
            scrollAmount = 0;
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollAmount += cardWidth;
            slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    setInterval(autoScroll, 3000);
}

function toggleMute() {
    var video = document.getElementById("trendingVid");
    var btn = document.getElementById("muteBtn");

    if (video.muted) {
        video.muted = false;
        btn.innerHTML = "🔊 Sound On";
    } else {
        video.muted = true;
        btn.innerHTML = "🔇 Mute";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var video = document.querySelector(".trending-video");
    if (video) {
        video.muted = true;
        video.play().then(() => {
            console.log("Video playing successfully!");
        }).catch((error) => {
            console.log("Autoplay blocked by browser:", error);
        });
    }
});
// --- 3. SHOWCASE BANNER SECTION (GLOBAL SCOPE FIX) ---

window.showcaseIdx = window.showcaseIdx || 0;
window.showcaseAutoTimer = window.showcaseAutoTimer || null;

function initShowcase() {
    const slides = document.querySelectorAll('.banner-slide');
    if (slides.length > 0) {
        bannerMove(0);
        startShowcaseAuto();
        console.log("Showcase initialized for Ashok Jewellery Art");
    }
}

function bannerMove(n) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');

    if (slides.length === 0) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    window.showcaseIdx = (window.showcaseIdx + n + slides.length) % slides.length;

    if (slides[window.showcaseIdx]) {
        slides[window.showcaseIdx].classList.add('active');
    }
    if (dots[window.showcaseIdx]) {
        dots[window.showcaseIdx].classList.add('active');
    }

    resetShowcaseTimer();
}

function bannerCurrent(n) {
    window.showcaseIdx = n;
    bannerMove(0);
}

function startShowcaseAuto() {
    if (window.showcaseAutoTimer) clearInterval(window.showcaseAutoTimer);

    window.showcaseAutoTimer = setInterval(() => {
        bannerMove(1);
    }, 5000);
}

function resetShowcaseTimer() {
    if (window.showcaseAutoTimer) {
        clearInterval(window.showcaseAutoTimer);
        startShowcaseAuto();
    }
}

// --- 4. EXECUTION ---
document.addEventListener("DOMContentLoaded", function () {
    if (typeof initTrendingSlider === "function") initTrendingSlider();
    initShowcase();
});

function bannerMove(n) {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');

    if (slides.length === 0) return;

    // Reset current active states
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    // Calculate next index
    showcaseIdx = (showcaseIdx + n + slides.length) % slides.length;

    // Apply active class
    slides[showcaseIdx].classList.add('active');
    if (dots[showcaseIdx]) dots[showcaseIdx].classList.add('active');

    resetShowcaseTimer();
}

// 3. Dot Click Function
function bannerCurrent(n) {
    showcaseIdx = n;
    bannerMove(0);
}

// 4. Auto-Slide Logic
function startShowcaseAuto() {
    // 5000ms = 5 seconds
    showcaseAutoTimer = setInterval(() => {
        bannerMove(1);
    }, 5000);
}

function resetShowcaseTimer() {
    clearInterval(showcaseAutoTimer);
    startShowcaseAuto();
}

// 5. Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.banner-slide')) {
        startShowcaseAuto();
    }
});

//whatsapp btn//
function enquireWhatsApp(category, ref) {
    const phone = "919890451915";
    const message = `Hi Ashok Jewellery Art, I am interested in this ${category} piece (Ref: ${ref}). Please share more details.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
//OUR STORY SHORT//
document.addEventListener('DOMContentLoaded', () => {
    const tabLinks = document.querySelectorAll('.story-links li');
    const mainImage = document.getElementById('storyImg');
    const infoTitle = document.getElementById('infoTitle');
    const infoText = document.getElementById('infoText');
    const visualColumn = document.querySelector('.col-visual');
    const infoColumn = document.querySelector('.col-info');


    let currentIndex = 0;
    let autoRotateInterval;
    const rotationTime = 6000;
    // --- 1. DATA STRUCTURE (Define new content here) ---
    const storyData = {
        'legacy': {
            title: 'Our Legacy',
            text: 'With a foundation built in 1965, Ashok Jewellery Art has been a beacon of purity for generations. Our journey is defined by an unwavering commitment to quality and transparency.',
            image: '/images/shortstorylegacy1.png' // original image 
        },
        'values': {
            title: 'Our Values',
            text: 'Trust, integrity, and ethical sourcing are our foundational pillars. We believe in crafting relationships, not just ornaments, ensuring every piece reflects our core beliefs.',
            image: '/images/shortstoryourvalue1.png', // Replace with  image path for Values
            link: '/Home/AboutUs#values-section'
        },
        'craft': {
            title: 'Craftsmanship',
            text: 'Our artisans are storytellers, transforming molten gold and precious gems into timeless works of art, blending ancestral knowledge with contemporary precision in every intricate detail.',
            image: '/images/shortstorycraftmanship1.png' // Replace with image path for Craft
        },
        'vision': {
            title: 'Our Vision',
            text: 'To redefine Indian heritage jewelry, blending tradition with modern artistry, and becoming the global standard for conscious luxury and artisanal excellence.',
            image: '/images/shortstoryourvision2.png' // Replace with  image path for Vision
        }
    };

    // --- 2. SWITCH CONTENT FUNCTION (With Smooth Transition) ---
    function updateContent(contentType) {

        const data = storyData[contentType];

        if (!data) return;


        const discoverLink = document.querySelector('.legacy-link');

        if (discoverLink && data.link) {

            discoverLink.href = data.link;

        }


        // a. Temporarily hide visual and info columns for effect

        visualColumn.style.opacity = '0';

        infoColumn.style.opacity = '0';

        // b. Use timeout to change content during fade-out

        setTimeout(() => {

            // Update Visual Content (First Image)

            mainImage.src = data.image;

            // Update Info Content (Text Box)

            infoTitle.textContent = data.title;

            infoText.textContent = data.text;

            // c. Fade columns back in

            visualColumn.style.opacity = '1';

            infoColumn.style.opacity = '1';

        }, 300); // Wait 300ms (duration of CSS fade out)
    }

    // --- 3. AUTO ROTATION LOGIC ---
    function startAutoRotation() {
        autoRotateInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % tabLinks.length;
            const nextTab = tabLinks[currentIndex];

            activateTab(nextTab);
        }, rotationTime);
    }
    function activateTab(tab) {
        if (!tab) return;

        const targetContent = tab.getAttribute('data-content');
        if (!targetContent) return;

        tabLinks.forEach(item => item.classList.remove('active'));
        tab.classList.add('active');
        updateContent(targetContent);
    }

    // --- 4. ATTACH CLICK LISTENERS (Handles tab activation) ---
    tabLinks.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            clearInterval(autoRotateInterval);
            currentIndex = index;

            activateTab(tab);
            startAutoRotation();
        });
    });

    startAutoRotation();
});



// for search bar//
function clearSearch() {

    setTimeout(function () {
        document.getElementById('searchInput').value = '';
        var dropdown = document.querySelector('.search-dropdown-list');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }, 100);
}
//for all category -nav bar//

document.addEventListener("DOMContentLoaded", function () {
    var megaLink = document.querySelector(".mega-parent > a");
    var megaParent = document.querySelector(".mega-parent");

    if (megaLink) {
        megaLink.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            megaParent.classList.toggle("active-menu");
        });
    }

    document.addEventListener("click", function () {
        if (megaParent) megaParent.classList.remove("active-menu");
    });
});

//JEWELLERY RATeS//


function updateLink(metal) {
    let baseUrl = '@Url.Action("Index", "Products")';
    let fullUrl = `${baseUrl}?subCategory=Pendant&metalType=${metal}`;
    document.getElementById("myLink").href = fullUrl;
}
//-----SEARCH BAR CAMERA -SPEAKER ICON---//

document.addEventListener("DOMContentLoaded", function () {

    // 1. Function to handle voice search and clean recognized text
    function setupVoiceSearch(inputId, micId) {
        const searchInput = document.getElementById(inputId);
        const micBtn = document.getElementById(micId);

        if (micBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;

            micBtn.addEventListener('click', function () {
                try {
                    recognition.start();
                    micBtn.style.color = '#ff0000'; // Turn mic icon red while listening
                } catch (e) {
                    console.error(e);
                }
            });

            recognition.onresult = function (event) {
                if (searchInput) {
                    let spokenText = event.results[0][0].transcript;

                    // Remove trailing periods and extra whitespace from speech result
                    spokenText = spokenText.trim().replace(/\.+$/, '');

                    searchInput.value = spokenText;
                }
                micBtn.style.color = '#666';
            };

            recognition.onerror = recognition.onend = function () {
                micBtn.style.color = '#666';
            };
        } else if (micBtn) {
            micBtn.style.display = 'none';
        }
    }

    setupVoiceSearch('searchInput', 'micBtn');
    setupVoiceSearch('searchInputMob', 'micBtnMob');

    // 2. Global form submit cleaner to strip trailing dots/periods and extra spaces
    document.querySelectorAll('form').forEach(form => {
        const searchInput = form.querySelector('input[name="searchString"]');
        if (searchInput) {
            form.addEventListener('submit', function (e) {
                let cleanedVal = searchInput.value.trim();

                // Remove trailing dot if present before submission
                if (cleanedVal.endsWith('.')) {
                    cleanedVal = cleanedVal.slice(0, -1).trim();
                }

                searchInput.value = cleanedVal;
            });
        }
    });

});


//----SEARCH BAR MOBILE RESPOBNSIVE--->//
document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("openSearchModal");
    const closeBtn = document.getElementById("closeSearchModal");
    const overlay = document.getElementById("mobileSearchOverlay");

    if (openBtn && overlay) {
        openBtn.addEventListener("click", function () {
            console.log("Search button clicked!");
            overlay.classList.add("active");
        });
    }

    if (closeBtn && overlay) {
        closeBtn.addEventListener("click", function () {
            overlay.classList.remove("active");
        });
    }
});

window.addEventListener("DOMContentLoaded", function () {
    function handleMobileLayout() {
        const oldSearch = document.querySelector(".nav-search-item");
        const hamburgerLi = document.querySelector(".hamburger-item");

        if (window.innerWidth <= 425) {
            if (oldSearch) {
                oldSearch.style.setProperty("display", "none", "important");
            }

            if (hamburgerLi) {
                hamburgerLi.style.setProperty("display", "flex", "important");
                hamburgerLi.style.setProperty("visibility", "visible", "important");
                hamburgerLi.style.setProperty("opacity", "1", "important");
            }
        } else {
            if (oldSearch) {
                oldSearch.style.removeProperty("display");
            }
            if (hamburgerLi) {
                hamburgerLi.style.removeProperty("display");
            }
        }
    }

    handleMobileLayout();
    window.addEventListener("resize", handleMobileLayout);
});

document.documentElement.style.overflowY = 'auto';
document.body.style.overflowY = 'auto';
document.documentElement.style.height = 'auto';
document.body.style.height = 'auto';

//FOR LOADING IMAGES FAST//

    window.addEventListener('pageshow', function (event) {
        // Detect if the page was loaded from history cache (BFCache)
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            
            // 1. Force all standard images to reload their sources
            const allImages = document.querySelectorAll('img');
            allImages.forEach(img => {
                if (img.src) {
                    const currentSrc = img.src;
    img.src = '';
    img.src = currentSrc;
                }
            });

    // 2. Re-trigger slider / carousel initialization if it exists on the page
    setTimeout(function() {
                // If using Slick Slider
                if (typeof jQuery !== 'undefined' && jQuery('.slider, .carousel, .hero-slider').length) {
        jQuery('.slider, .carousel, .hero-slider').slick('setPosition');
                }

    // If using a generic window resize trigger to fix layout collapse
    window.dispatchEvent(new Event('resize'));
            }, 100);
        }
    });

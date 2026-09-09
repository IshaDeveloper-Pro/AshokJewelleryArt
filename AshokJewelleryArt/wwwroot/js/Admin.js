/* ==========================================================
   ASHOK JEWELLERY ART - ADMIN PANEL LOGIC (FINAL UPDATED)
   ========================================================== */

// 2. MODAL & TOAST LOGIC
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    if (!modal) return;

    document.getElementById('modalTitle').innerText = "Success!";
    document.getElementById('modalTitle').style.color = "#28a745";
    document.getElementById('modalIcon').className = "fa fa-check-circle";
    document.getElementById('modalIcon').style.color = "#28a745"; 
    document.getElementById('successMessageText').innerText = message;

    const btn = modal.querySelector('button');
    if (btn) {
        btn.innerText = "OK";                  
        btn.style.background = "#28a745";       
        btn.onclick = function () {
            modal.style.display = 'none';
            location.reload();
        };
    }

    modal.style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload();
}

    function showToast(message) {
        let toast = document.getElementById("toast-popup");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-popup";
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.className = "show";

        setTimeout(function () {
            toast.className = toast.className.replace("show", "");
        }, 2000); // 2 Seconds
    }
   
    //1. all section ko hide 
    function hideAllSections() {
        document.getElementById('productInventorySection').style.display = 'none';
        document.getElementById('ordersSection').style.display = 'none';
        document.getElementById('calculatorSection').style.display = 'none';
        document.getElementById('settingsSection').style.display = 'none';

        // links  'active' class remove 
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    }


    // 7. RESET SYSTEM LOGIC
    function resetAllFields() {
        document.getElementById('resetModal').style.display = 'flex';
    }

    function closeResetModal() {
        document.getElementById('resetModal').style.display = 'none';
    }

    function executeReset() {
        closeResetModal();
        showSuccessModal("System Reset Successful!");
    }

//START DIRECT UPLOAD//



// --- 3. IMAGE PREVIEW ---
    function previewDirectImage(event) {
        const reader = new FileReader();
        const preview = document.getElementById('direct-preview');
        const content = document.getElementById('preview-content');

        reader.onload = function () {
            if (reader.readyState === 2) {
                preview.src = reader.result;
                preview.classList.remove('d-none');
                if (content) content.classList.add('d-none');
            }
        }
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
    }

  
    function silentResetForm() {
        document.getElementById('direct-image').value = "";
        const preview = document.getElementById('direct-preview');
        if (preview) {
            preview.src = "";
            preview.classList.add('d-none');
        }

        const content = document.getElementById('preview-content');
        if (content) content.classList.remove('d-none');

        document.getElementById('direct-title').value = "";
        document.getElementById('direct-weight').value = "";
        document.getElementById('direct-price').innerText = "₹ 0";

        document.getElementById('direct-collection').selectedIndex = 0;
        document.getElementById('direct-material').selectedIndex = 0;
    }
    // --- 5. WEIGHT LIST GENERATOR ---
    document.addEventListener('DOMContentLoaded', () => {
        const weightList = document.getElementById('weight-options');
        if (weightList) {
            for (let i = 1; i <= 200; i++) {
                let option = document.createElement('option');
                option.value = i;
                weightList.appendChild(option);
            }
        }
    });
    //current inventory section//
    function toggleInventoryView() {
        const wrapper = document.getElementById('inventoryWrapper');
        const btn = document.getElementById('seeAllBtn');

        if (wrapper.classList.contains('expanded')) {
            wrapper.classList.remove('expanded');
            btn.innerText = "See All";
            // Smoothly scroll back to top if list was long
            wrapper.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            wrapper.classList.add('expanded');
            btn.innerText = "Show Less";
        }
    }


    // 1. Enter Key Handle
    function handleSearchKeyPress(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchInventory();
        }
    }

// 2. Master Search Function 
let searchTimeout;
function searchInventory() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (event) event.preventDefault();
        var input = document.getElementById("inventorySearch");
        if (!input) return;
        var rawInput = input.value.trim();
        var upperInput = rawInput.toUpperCase();

        var table = document.getElementById("invTable");
        if (!table) return;
        var tr = table.getElementsByTagName("tr");

        var allCells = table.querySelectorAll('td');
        for (let j = 0; j < allCells.length; j++) {
            allCells[j].style.backgroundColor = "";
            allCells[j].style.fontWeight = "normal";
        }

        if (rawInput === "") {
            for (var i = 1; i < tr.length; i++) tr[i].style.display = "";
            updateSearchCount(tr.length - 1);
            return;
        }

        var isIdSearch = upperInput.startsWith("#");
        var isMetalPrefix = upperInput.startsWith("M-");
        var isCatPrefix = upperInput.startsWith("C-");
        var isDateSearch = rawInput.includes("/") || rawInput.includes("-");

        // Smart Carat vs Gram detection
        var isCaratSearch = upperInput.endsWith("CT");
        var isGramSearch = upperInput.endsWith("G");
        var isWeightSearch = isCaratSearch || isGramSearch || (!isNaN(rawInput) && rawInput.includes("."));
        var filterNumeric = rawInput.replace(/[^\d.]/g, '');

        var visibleCount = 0;

        for (var i = 1; i < tr.length; i++) {
            var tds = tr[i].getElementsByTagName("td");
            if (tds.length === 0) continue;

            var showRow = false;
            var highlightCol = -1;

            if (isMetalPrefix) {
                var term = upperInput.substring(2).trim();
                highlightCol = 4;
                var cellVal = (tds[4].textContent || tds[4].innerText).toUpperCase().trim();
                if (term !== "" && cellVal === term) showRow = true;
            } else if (isCatPrefix) {
                var term = upperInput.substring(2).trim();
                highlightCol = 8;
                var cellVal = (tds[8].textContent || tds[8].innerText).toUpperCase().trim();
                if (term !== "" && cellVal.includes(term)) showRow = true;
            } else if (isIdSearch) {
                highlightCol = 1;
                var idVal = (tds[1].textContent || tds[1].innerText).toUpperCase().trim();
                if (idVal === upperInput) showRow = true;
            } else if (isWeightSearch && !isNaN(filterNumeric)) {
                highlightCol = 6;
                var weightText = (tds[6].textContent || tds[6].innerText).toUpperCase().trim();
                var cellWeightNum = weightText.replace(/[^\d.]/g, '');
                var metalText = (tds[4].textContent || tds[4].innerText).toUpperCase().trim();

                if (cellWeightNum !== "" && Number(cellWeightNum) === Number(filterNumeric)) {
                    if (isCaratSearch) {
                        if (metalText.includes("DIAMOND") || metalText.includes("GEMSTONE") || weightText.includes("CT")) {
                            showRow = true;
                        }
                    } else if (isGramSearch) {
                        // FIXED: 'g' search -- Diamond, Gemstone aur CT items hide 
                        if (!metalText.includes("DIAMOND") && !metalText.includes("GEMSTONE") && !weightText.includes("CT")) {
                            showRow = true;
                        }
                    } else {
                        showRow = true;
                    }
                }
            } else if (isDateSearch) {
                highlightCol = 2;
                var dateVal = (tds[2].textContent || tds[2].innerText).trim();
                var searchParts = rawInput.split(/[\/-]/).map(p => Number(p).toString());
                var dateParts = dateVal.split(/[\/-]/).map(p => Number(p).toString());
                if (searchParts.length >= 2 && dateParts.length >= 2) {
                    if (dateParts[0] === searchParts[0] && dateParts[1] === searchParts[1]) {
                        showRow = true;
                    }
                } else if (dateVal === rawInput) {
                    showRow = true;
                }
            } else if (!isNaN(rawInput) && rawInput !== "" && !rawInput.includes(".")) {
                highlightCol = 0;
                var srText = (tds[0].textContent || tds[0].innerText).trim();
                if (srText === rawInput) showRow = true;
            } else {
                var rowText = tr[i].innerText.toUpperCase();
                if (rowText.includes(upperInput)) showRow = true;
            }

            if (showRow) {
                tr[i].style.display = "";
                visibleCount++;
                if (highlightCol !== -1 && tds[highlightCol]) {
                    tds[highlightCol].style.backgroundColor = "#ffdf91";
                    tds[highlightCol].style.fontWeight = "bold";
                } else {
                    for (var k = 0; k < tds.length; k++) {
                        var cText = (tds[k].textContent || tds[k].innerText).toUpperCase();
                        if (cText.includes(upperInput)) {
                            tds[k].style.backgroundColor = "#ffdf91";
                            tds[k].style.fontWeight = "bold";
                        }
                    }
                }
            } else {
                tr[i].style.display = "none";
            }
           
        }
        updateSearchCount(visibleCount);
    }, 100);
}
// 1. Enter key support ke liye
document.getElementById("inventorySearch").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchInventory();
    }
});

document.querySelector("button[onclick='searchInventory()']").addEventListener("click", searchInventory);
function updateSearchCount(count) {
    var blueBtn = document.querySelector('.total-items-btn') ||
        document.querySelector('.bg-info') ||
        document.getElementById("totalInventoryCount");
    if (blueBtn) {
        blueBtn.innerText = "Total Items: " + count;
    }
}


let searchMultiTimeout;
function searchInventoryMulti() {
    clearTimeout(searchMultiTimeout);
    searchMultiTimeout = setTimeout(() => {
        var input = document.getElementById("inventorySearchMulti");
        if (!input) return;
        var rawInput = input.value.trim();
        var upperInput = rawInput.toUpperCase();
        var table = document.getElementById("invTableMulti");
        if (!table) return;
        var tr = table.getElementsByTagName("tr");

        var allCells = table.querySelectorAll('td');
        for (let j = 0; j < allCells.length; j++) {
            allCells[j].style.backgroundColor = "";
            allCells[j].style.fontWeight = "normal";
        }

        if (rawInput === "") {
            for (var i = 1; i < tr.length; i++) tr[i].style.display = "";
            updateSearchCount(tr.length - 1);
            return;
        }

        var isIdSearch = upperInput.startsWith("#");
        var isMetalPrefix = upperInput.startsWith("M-");
        var isCatPrefix = upperInput.startsWith("C-");
        var isDateSearch = rawInput.includes("/") || rawInput.includes("-");
        var isCaratSearch = upperInput.endsWith("CT");
        var isGramSearch = upperInput.endsWith("G");
        var isWeightSearch = isCaratSearch || isGramSearch || (!isNaN(rawInput) && rawInput.includes("."));
        var filterNumeric = rawInput.replace(/[^\d.]/g, '');

        var visibleCount = 0;

        for (var i = 1; i < tr.length; i++) {
            var tds = tr[i].getElementsByTagName("td");
            if (tds.length === 0) continue;

            var showRow = false;
            var highlightCol = -1;

            if (isMetalPrefix) {
                var term = upperInput.substring(2).trim();
                highlightCol = 4;
                var cellVal = (tds[4].textContent || tds[4].innerText).toUpperCase().trim();
                if (term !== "" && cellVal === term) showRow = true;
            } else if (isCatPrefix) {
                var term = upperInput.substring(2).trim();
                highlightCol = 8;
                var cellVal = (tds[8].textContent || tds[8].innerText).toUpperCase().trim();
                if (term !== "" && cellVal.includes(term)) showRow = true;
            } else if (isIdSearch) {
                highlightCol = 1;
                var idVal = (tds[1].textContent || tds[1].innerText).toUpperCase().trim();
                if (idVal === upperInput) showRow = true;
            } else if (isWeightSearch && !isNaN(filterNumeric)) {
                highlightCol = 6;
                var weightText = (tds[6].textContent || tds[6].innerText).toUpperCase().trim();
                var cellWeightNum = weightText.replace(/[^\d.]/g, '');
                var metalText = (tds[4].textContent || tds[4].innerText).toUpperCase().trim();

                if (cellWeightNum !== "" && Number(cellWeightNum) === Number(filterNumeric)) {
                    if (isCaratSearch) {
                        if (metalText.includes("DIAMOND") || metalText.includes("GEMSTONE") || weightText.includes("CT")) {
                            showRow = true;
                        }
                    } else if (isGramSearch) {
                        // FIXED: 'g' search - Diamond, Gemstone aur CT  items hide 
                        if (!metalText.includes("DIAMOND") && !metalText.includes("GEMSTONE") && !weightText.includes("CT")) {
                            showRow = true;
                        }
                    } else {
                        showRow = true;
                    }
                }
            } else if (isDateSearch) {
                highlightCol = 2;
                var dateVal = (tds[2].textContent || tds[2].innerText).trim();
                var searchParts = rawInput.split(/[\/-]/).map(p => Number(p).toString());
                var dateParts = dateVal.split(/[\/-]/).map(p => Number(p).toString());
                if (searchParts.length >= 2 && dateParts.length >= 2) {
                    if (dateParts[0] === searchParts[0] && dateParts[1] === searchParts[1]) {
                        showRow = true;
                    }
                } else if (dateVal === rawInput) {
                    showRow = true;
                }
            } else if (!isNaN(rawInput) && rawInput !== "" && !rawInput.includes(".")) {
                highlightCol = 0;
                var srText = (tds[0].textContent || tds[0].innerText).trim();
                if (srText === rawInput) showRow = true;
            } else {
                var rowText = tr[i].innerText.toUpperCase();
                if (rowText.includes(upperInput)) showRow = true;
            }

            if (showRow) {
                tr[i].style.display = "";
                visibleCount++;
                if (highlightCol !== -1 && tds[highlightCol]) {
                    tds[highlightCol].style.backgroundColor = "#ffdf91";
                    tds[highlightCol].style.fontWeight = "bold";
                } else {
                    for (var k = 0; k < tds.length; k++) {
                        var cText = (tds[k].textContent || tds[k].innerText).toUpperCase();
                        if (cText.includes(upperInput)) {
                            tds[k].style.backgroundColor = "#ffdf91";
                            tds[k].style.fontWeight = "bold";
                        }
                    }
                }
            } else {
                tr[i].style.display = "none";
            }
           
        }
        updateSearchCount(visibleCount);
    }, 100);
}
function handleMultiEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchInventoryMulti();
    }
}

//refresh--//
function refreshInventory() {
    // 1. Search input 
    var input = document.getElementById("inventorySearch");
    if (input) input.value = "";

    // 2. Table 
    var trs = document.querySelectorAll('#invTable tr');
    trs.forEach(tr => {
        tr.style.display = "";
    });

    // 3. Highlights and inline styles
    var allCells = document.querySelectorAll('#invTable td');
    allCells.forEach(td => {

        td.style.backgroundColor = "";
        td.style.fontWeight = "";

    });

    // 4. "No Data Found" message hide
    var noDataRow = document.getElementById("noDataRow");
    if (noDataRow) noDataRow.style.display = "none";


    // --- FLASH FEEDBACK LOGIC START ---
    var table = document.getElementById("invTable");
    if (table) {
        // Table transparent 
        table.style.transition = "opacity 0.2s ease";
        table.style.opacity = "0.3";

        setTimeout(() => {
            table.style.opacity = "1";
        }, 200);
    }
    // --- FLASH FEEDBACK LOGIC END ---

    if (trs.length > 0) {
        updateSearchCount(trs.length - 1);
    }

    console.log("Inventory Refreshed with Flash!");
}

// Refresh function specifically for Multi-Products tab & inventory
function refreshMultiInventory() {
    // 1. Search input (Multi)
    var input = document.getElementById("inventorySearchMulti");
    if (input) input.value = "";

    // 2. Table rows (Multi)
    var trs = document.querySelectorAll('#invTableMulti tr');
    trs.forEach(tr => {
        tr.style.display = "";
    });

    // 3. Highlights and inline styles (Multi)
    var allCells = document.querySelectorAll('#invTableMulti td');
    allCells.forEach(td => {
        td.style.backgroundColor = "";
        td.style.fontWeight = "";
    });

    // 4. "No Data Found" message hide (Multi)
    var noDataRow = document.getElementById("noDataRowMulti");
    if (noDataRow) noDataRow.style.display = "none";

    // 5. Clear Multi-Products Upload Form Fields & Cards Container
    var multiSection = document.getElementById("multiProductsSection");
    if (multiSection) {
        multiSection.querySelectorAll("select").forEach(sel => sel.selectedIndex = 0);
        multiSection.querySelectorAll("input[type='text'], input[type='number']").forEach(inp => inp.value = "");

        var fileInput = document.getElementById("bulk-images-input");
        if (fileInput) fileInput.value = "";
    }

    var cardsContainer = document.getElementById("bulk-cards-container");
    if (cardsContainer) cardsContainer.innerHTML = "";

    var actionsRow = document.getElementById("bulk-actions-row");
    if (actionsRow) actionsRow.classList.add("d-none");

    // --- FLASH FEEDBACK LOGIC START (Multi) ---
    var table = document.getElementById("invTableMulti");
    if (table) {
        // Table transparent 
        table.style.transition = "opacity 0.2s ease";
        table.style.opacity = "0.3";

        setTimeout(() => {
            table.style.opacity = "1";
        }, 200);
    }
    // --- FLASH FEEDBACK LOGIC END ---

    if (typeof updateSearchCount === 'function' && trs.length > 0) {
        updateSearchCount(trs.length - 1);
    }

    console.log("Multi-Products Inventory Refreshed with Flash!");
}
//TABS  SECTION//
function showProducts() {
    var calc = document.getElementById('calculatorSection');
    var inv = document.getElementById('productInventorySection');
    var ord = document.getElementById('ordersSection');
    var sett = document.getElementById('settingsSection');
    var multi = document.getElementById('multiProductsSection');
    var multiInv = document.getElementById('multiInventorySection'); // Multi Inventory Table

    if (calc) calc.style.display = 'none';
    if (inv) inv.style.display = 'none';
    if (ord) ord.style.display = 'none';
    if (sett) sett.style.display = 'none';
    if (multi) multi.style.display = 'none';
    if (multiInv) multiInv.style.display = 'none'; // Table hide 

  
}

function showOrders() {
    if (document.getElementById('productInventorySection')) document.getElementById('productInventorySection').style.display = 'none';
    if (document.getElementById('calculatorSection')) document.getElementById('calculatorSection').style.display = 'none';
    if (document.getElementById('settingsSection')) document.getElementById('settingsSection').style.display = 'none';

    // [FIX]: Multi-product close here
    if (document.getElementById('multiProductsSection')) {
        document.getElementById('multiProductsSection').style.display = 'none';
    }

    const orders = document.getElementById('ordersSection');
    if (orders) orders.style.display = 'block';

    updateActiveLink('ordersSection');
}

function showCalculator() {
    if (document.getElementById('productInventorySection')) document.getElementById('productInventorySection').style.display = 'none';
    if (document.getElementById('ordersSection')) document.getElementById('ordersSection').style.display = 'none';
    if (document.getElementById('settingsSection')) document.getElementById('settingsSection').style.display = 'none';

    // [FIX]: Multi-product close here
    if (document.getElementById('multiProductsSection')) {
        document.getElementById('multiProductsSection').style.display = 'none';
    }

    const calc = document.getElementById('calculatorSection');
    if (calc) {
        calc.style.display = 'block';
        window.scrollTo(0, 0);
    }
    updateActiveLink('calculatorSection');
}

function showSettings() {
    if (document.getElementById('productInventorySection')) document.getElementById('productInventorySection').style.display = 'none';
    if (document.getElementById('calculatorSection')) document.getElementById('calculatorSection').style.display = 'none';
    if (document.getElementById('ordersSection')) document.getElementById('ordersSection').style.display = 'none';

    // [FIX]: Settings open and  multi-product hide
    if (document.getElementById('multiProductsSection')) {
        document.getElementById('multiProductsSection').style.display = 'none';
    }

    if (document.getElementById('settingsSection')) document.getElementById('settingsSection').style.display = 'block';
    updateActiveLink('settingsSection');
}
    // 6. Reset All Data Function
    function resetAllFields() {
        if (confirm("Are you sure you want to reset all calculator data ? ")) {
            // Calculator - inputs clear 
            document.getElementById('calcCurrentRate').value = '';
            document.getElementById('calcCustomWeight').value = '';
            document.getElementById('calcMakingCharges').value = '';
            document.getElementById('calcWeightSelect').value = '1';
            document.getElementById('calcGst').value = '3';
            document.getElementById('calcResult').style.display = 'none';
            document.getElementById('calcCustomWeight').style.display = 'none';
        }
    }

// --- 6. SIDEBAR TAB ACTIVE HIGHLIGHTER (Option 2 - Fixed & Safe) ---
function activateTab(btnId) {
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });

    // 2.  button  parent 'li'  active class 
    const activeBtn = document.getElementById(btnId);
    if (activeBtn && activeBtn.parentElement) {
        activeBtn.parentElement.classList.add('active');
    }

 
    document.activeElement.blur();
}

// --- GOLD & SILVER LIVE RATES LOGIC ---//
window.onload = function () {
};


// --- 1. TAB SWITCHING LOGIC (Merged & Cleaned) ---//
function switchSection(sectionId) {
    const sections = [
        'productInventorySection',
        'ordersSection',
        'calculatorSection',
        'settingsSection',
        'multiProductsSection'
    ];

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.setProperty('display', 'none', 'important');
        }
    });

    const multiTableContainer = document.getElementById('multiInventoryContainer');
    if (multiTableContainer) {
        multiTableContainer.style.setProperty('display', 'none', 'important');
    }

    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        window.scrollTo(0, 0);
    }

    if (sectionId === 'multiProductsSection') {
        if (multiTableContainer) {
            multiTableContainer.style.setProperty('display', 'block', 'important');
        }
    }

    if (typeof updateActiveLink === 'function') {
        updateActiveLink(sectionId);
    }
}

function updateActiveLink(sectionId) {
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });

    if (sectionId === 'productInventorySection') {
        var prod = document.getElementById('prodLink');
        if (prod) prod.parentElement.classList.add('active');
    }
    // --- MULTI TAB LINK LOGIC ---//
    else if (sectionId === 'multiProductsSection') {
        var multi = document.getElementById('multiProdLink');
        if (multi) multi.parentElement.classList.add('active');
    }
    else if (sectionId === 'ordersSection') {
        var ord = document.getElementById('ordLink');
        if (ord) ord.parentElement.classList.add('active');
    }
    else if (sectionId === 'calculatorSection') {
        var calc = document.getElementById('calcLink');
        if (calc) calc.parentElement.classList.add('active');
    }
    else if (sectionId === 'settingsSection') {
        const settingBtn = document.getElementById('settingTabBtn');
        if (settingBtn) {
            settingBtn.parentElement.classList.add('active');
        }
    }

    document.activeElement.blur();
}


    // --- 2. IMAGE PREVIEW (Unified) ---
    function handleImagePreview(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                const preview = document.getElementById('imgPreview') || document.getElementById('direct-preview');
                const wrapper = document.getElementById('previewWrapper') || document.getElementById('preview-content');

                if (preview) {
                    preview.src = e.target.result;
                    preview.classList.remove('d-none');
                }
                if (wrapper) wrapper.style.display = 'block';

                const saveBtn = document.getElementById('saveItemBtn');
                if (saveBtn) saveBtn.style.display = 'block';
            }
            reader.readAsDataURL(input.files[0]);
        }
    }



    // Calculator Reset (Updated with ID checks)
    function resetCalculatorFields() {
        if (confirm("Bhai, calculator clear karun?")) {
            const fields = ['calcCurrentRate', 'calcCustomWeight', 'calcMakingCharges'];
            fields.forEach(id => document.getElementById(id).value = '');
            document.getElementById('calcWeightSelect').value = '1';
            document.getElementById('calcResult').style.display = 'none';
            document.getElementById('calcCustomWeight').style.display = 'none';
        }
    }



async function saveDirectProduct() {
    const title = document.getElementById('direct-title').value.trim();
    const collection = document.getElementById('direct-collection').value;
    const imageFile = document.getElementById('direct-image').files[0];
    const priceValue = document.getElementById('direct-price').innerText.replace(/[^\d]/g, '');
    const materialElement = document.getElementById('direct-material');

    // Dropdown se selected metal type lene ke liye
    let metalType = document.getElementById('direct-metal-type').value;

    const description = document.getElementById('direct-description')?.value || "";
    const genderValue = document.getElementById('pGender').value;

    let isTrending = (collection === "Trending") ? 1 : 0;
    let isNewArrival = (collection === "New Arrival") ? 1 : 0;
    let isBridal = (collection === "Bridal" || title.includes("Bridal")) ? 1 : 0;

    // --- ROBUST WEIGHT DETECTION (Based on active section) ---
    let weight = "";
    const gramSec = document.getElementById('weight-grams-section');
    const caratSec = document.getElementById('weight-carat-section');
    const diamondSec = document.getElementById('weight-diamond-section');

    let weightField = null;

    if (gramSec && window.getComputedStyle(gramSec).display !== 'none') {
        weightField = document.getElementById('direct-weight');
    } else if (caratSec && window.getComputedStyle(caratSec).display !== 'none') {
        weightField = document.getElementById('direct-carat');
    } else if (diamondSec && window.getComputedStyle(diamondSec).display !== 'none') {
        weightField = document.getElementById('direct-diamond-carat');
    }

    // Fallback if none matched
    if (!weightField) {
        weightField = document.getElementById('direct-weight') ||
            document.getElementById('direct-carat') ||
            document.getElementById('direct-diamond-carat');
    }

    if (weightField) {
        weight = weightField.value.trim();
    }

    console.log("Debugging Values:", {
        title: title,
        weight: weight,
        imageFile: imageFile,
        imageElement: document.getElementById('direct-image') ? document.getElementById('direct-image').files[0] : "Element not found"
    });
    // --- VALIDATION ---

    if (!title || !weight || !imageFile) {
        showWarningModal("Title, Weight and Image are mandatory!");
        return;
    }

    const formData = new FormData();
    formData.append("pName", title);
    formData.append("pWeight", weight);
    formData.append("pPrice", priceValue);
    formData.append("pCategory", collection);
    formData.append("pGender", genderValue);

    // --- SUB-CATEGORY LOGIC ---
    formData.append("pSubCategory", title);

    // --- SMART METAL TYPE DETECTION (Fallback agar dropdown khali ho) ---
    let materialValue = "";

    if (materialElement) {
        materialValue = materialElement.value;
    }
    else if (collection === "Diamond") {
        materialValue = "Diamond";
    }

    // Agar dropdown se metal select nahi kiya toh smart logic 
    if (!metalType) {
        metalType = collection;
        if (collection !== "Diamond" && collection !== "Gemstone") {
            if (materialValue.includes("Silver") || collection === "Silver") {
                metalType = "Silver";
            } else if (materialValue.includes("1 Gram")) {
                metalType = "1 Gram Gold";
            } else if (materialValue.includes("K")) {
                metalType = "Gold";
            }
        }
    }

    // --- ALL COLUMNS APPENDING ---
    formData.append("MaterialType", materialValue);
    formData.append("pMetalType", metalType);
    formData.append("imgInput", imageFile);

    // Boolean values as integers (1/0)
    formData.append("isTrending", isTrending);
    formData.append("isNewArrival", isNewArrival);
    formData.append("isBridal", isBridal);
    formData.append("pDescription", description);

    // Weight Unit detection
    let weightUnit = (collection === "Diamond" || collection === "Gemstone") ? "carat" : "gm";
    formData.append("pWeightUnit", weightUnit);

    try {
        const response = await fetch('/Admin/AddProduct', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            showSuccessModal(title + " Saved to Inventory! ✔");

            const newId = data.id || data.productId || "New";
            const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
            const imageUrl = imageFile ? URL.createObjectURL(imageFile) : '';
            const formattedPrice = '₹' + Number(priceValue).toLocaleString();

            const multiTableBody = document.querySelector('#invTableMulti tbody');
            if (multiTableBody) {
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-product-id', newId);
                newRow.innerHTML = `
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap;">-</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap;">#${newId}</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap;">${currentDate}</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap;"><img src="${imageUrl}" style="width:26px; height:26px; object-fit:cover; border-radius: 4px;"></td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: left; vertical-align: middle; white-space: nowrap; font-weight: bold; color: #d4af37;">${metalType}</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: left; vertical-align: middle; white-space: nowrap;">${title}</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap;">${weight}</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap;">${formattedPrice}</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap; text-transform: capitalize; color:darkcyan;font-weight:bold;">${collection}</td>
                    <td style="padding: 8px 6px; font-size: 11px; text-align: center; vertical-align: middle; white-space: nowrap;">
                        <div style="display: flex; gap: 4px; justify-content: center;">
                            <button type="button" class="btn-update" style="padding: 4px 6px; font-size: 10px;" onclick="handleUpdate('${newId}', '${title.replace(/'/g, "\\'")}', '${weight}', '${priceValue}', '${metalType}', '${collection}', '${materialValue}')">Update</button>
                            <button type="button" class="btn-delete" style="padding: 4px 6px; font-size: 10px;" onclick="handleDelete('${newId}')">Delete</button>
                        </div>
                    </td>
                `;

                multiTableBody.insertBefore(newRow, multiTableBody.firstChild);

                newRow.style.transition = 'background-color 0.3s ease';
                newRow.style.backgroundColor = '#d4edda';
                setTimeout(() => {
                    newRow.style.backgroundColor = '';
                }, 1500);
            }

            const totalBadge = document.getElementById('totalCountMulti');
            if (totalBadge) {
                let currentCount = parseInt(totalBadge.innerText) || 0;
                totalBadge.innerText = currentCount + 1;
            }

            // Form fields clear 
            document.getElementById('direct-title').value = '';
            if (document.getElementById('direct-weight')) document.getElementById('direct-weight').value = '';
            if (document.getElementById('direct-carat')) document.getElementById('direct-carat').value = '';
            if (document.getElementById('direct-diamond-carat')) document.getElementById('direct-diamond-carat').value = '';
            document.getElementById('direct-image').value = '';

        } else {
            showWarningModal("Error: " + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showWarningModal("Server connection failed!");
    }
}


    //message box warning//
function showWarningModal(message) {
    const modal = document.getElementById('successModal');
    document.getElementById('modalTitle').innerText = "Action Required";
    document.getElementById('modalTitle').style.color = "#d9534f";
    document.getElementById('modalIcon').className = "fa fa-exclamation-triangle";
    document.getElementById('modalIcon').style.color = "#d9534f";
    document.getElementById('successMessageText').innerText = message;

    const btn = modal.querySelector('button');
    btn.innerText = "Try Again";
    btn.style.background = "#d9534f";
    btn.onclick = function () { modal.style.display = 'none'; };

    modal.style.display = 'flex';
}

    // 1. Dropdown aur Weight Toggle Function (Space Fix ke saath)

function toggleGemstoneView() {
    const collectionSelect = document.getElementById('direct-collection');
    if (!collectionSelect) return;

    const collectionValue = collectionSelect.value;
    const cLower = collectionValue.toLowerCase();

    const materialSelect = document.getElementById('direct-material');
    const gramSection = document.getElementById('weight-grams-section');
    const caratSection = document.getElementById('weight-carat-section');
    const diamondSection = document.getElementById('weight-diamond-section');
    const metalSection = document.getElementById('metal-type-section');
    const gemstoneSectionDiv = document.getElementById('gemstone-section');

    if (gramSection) gramSection.style.setProperty('display', 'none', 'important');
    if (caratSection) caratSection.style.setProperty('display', 'none', 'important');
    if (diamondSection) diamondSection.style.setProperty('display', 'none', 'important');

    const isGemstoneCollection = cLower.includes("gemstone") || cLower.includes("emerald") || cLower.includes("ruby") || cLower.includes("sapphire") || cLower.includes("pearl") || cLower.includes("navratna") || cLower.includes("pukhraj") || cLower.includes("neelam");
    const isDiamondCollection = cLower.includes("diamond");
    const isSilverCollection = cLower.includes("silver");

    if (gemstoneSectionDiv) {
        if (isGemstoneCollection) {
            gemstoneSectionDiv.style.display = "block";
        } else {
            gemstoneSectionDiv.style.display = "none";
            const gemInput = document.getElementById('direct-gemstone');
            if (gemInput) gemInput.value = "";
        }
    }

    if (materialSelect) materialSelect.innerHTML = "";

    // CASE 1: Pure Diamond Collection
    if (isDiamondCollection) {
        if (materialSelect) {
            materialSelect.innerHTML = `
                <option value="VVS-EF">VVS - EF (Sabse Saaf - White)</option>
                <option value="VVS-FG">VVS - FG (Premium Quality)</option>
                <option value="SI-GH">SI - GH (Standard)</option>
                <option value="SI-IJ">SI - IJ (Budget Quality)</option>`;
        }
        if (diamondSection) diamondSection.style.setProperty('display', 'block', 'important');
    }
    // CASE 2: Pure Gemstone Collection
    else if (isGemstoneCollection) {
        if (materialSelect) {
            materialSelect.innerHTML = `
                  <option value="Emerald (Panna)">Emerald (Panna)</option>
            <option value="Ruby (Manik / Manek)">Ruby (Manik / Manek)</option>
            <option value="Yellow Sapphire (Pukhraj)">Yellow Sapphire (Pukhraj)</option>
            <option value="Blue Sapphire (Neelam)">Blue Sapphire (Neelam)</option>
            <option value="Hessonite (Gomed)">Hessonite (Gomed)</option>
            <option value="Pearl (Moti)">Pearl (Moti)</option>
            <option value="Amethyst (Jamuniya)">Amethyst (Jamuniya)</option>
            <option value="Navratna (9 Gems)">Navratna (9 Gems)</option>
            <option value="Onyx Emerald">Onyx Emerald</option>
            <option value="Mangal Oval">Mangal Oval</option>
            <option value="Normal Manik">Normal Manik</option>
            <option value="High Quality Manik">High Quality Manik</option>
            <option value="Other Gemstone">Other Gemstone</option>`;
        }
        if (caratSection) caratSection.style.setProperty('display', 'block', 'important');
    }
    // CASE 3: Pure Silver Collection
    else if (isSilverCollection) {
        if (materialSelect) {
            materialSelect.innerHTML = `
                <option value="925 Silver">925 Sterling Silver</option>
                <option value="999 Silver">999 Pure Silver</option>
                <option value="Chandi">Normal Chandi</option>`;
        }
        if (gramSection) gramSection.style.setProperty('display', 'block', 'important');
    }
    // CASE 4: Other / New Arrival (Saare options ek sath, aur material ke hisab se weight box change )
    else {
        if (materialSelect) {
            materialSelect.innerHTML = `
                <optgroup label="Gold Purity">
                    <option value="24K Gold">24K Gold</option>
                    <option value="22K Gold" selected>22K Gold</option>
                    <option value="18K Gold">18K Gold</option>
                    <option value="1 Gram Gold">1 Gram Gold</option>
                    <option value="14K">14K Gold</option>
                </optgroup>
                <optgroup label="Diamond Quality">
                    <option value="VVS-EF">VVS - EF</option>
                    <option value="VVS-FG">VVS - FG</option>
                    <option value="SI-GH">SI - GH</option>
                    <option value="SI-IJ">SI - IJ</option>
                </optgroup>
                <optgroup label="Silver">
                    <option value="925 Silver">925 Sterling Silver</option>
                    <option value="999 Silver">999 Pure Silver</option>
                </optgroup>
                <optgroup label="Gemstones">
                     <option value="Emerald (Panna)">Emerald (Panna)</option>
            <option value="Ruby (Manik / Manek)">Ruby (Manik / Manek)</option>
            <option value="Yellow Sapphire (Pukhraj)">Yellow Sapphire (Pukhraj)</option>
            <option value="Blue Sapphire (Neelam)">Blue Sapphire (Neelam)</option>
            <option value="Hessonite (Gomed)">Hessonite (Gomed)</option>
            <option value="Pearl (Moti)">Pearl (Moti)</option>
            <option value="Amethyst (Jamuniya)">Amethyst (Jamuniya)</option>
            <option value="Navratna (9 Gems)">Navratna (9 Gems)</option>
            <option value="Onyx Emerald">Onyx Emerald</option>
            <option value="Mangal Oval">Mangal Oval</option>
            <option value="Normal Manik">Normal Manik</option>
            <option value="High Quality Manik">High Quality Manik</option>
            <option value="Other Gemstone">Other Gemstone</option>
                </optgroup>
                <option value="Other">Other</option>`;
        }
        // In "Other", the default grams section will be shown initially, but it will update when the material changes.
        updateWeightBasedOnMaterial();
    }

    if (metalSection) {
        metalSection.style.setProperty('display', 'block', 'important');
    }
}

// Helper function: To change the weight box when a material is selected in the "Other" category
function updateWeightBasedOnMaterial() {
    const materialSelect = document.getElementById('direct-material');
    if (!materialSelect) return;
    const matVal = materialSelect.value;
    const matLower = matVal.toLowerCase();

    const gramSec = document.getElementById('weight-grams-section');
    const caratSec = document.getElementById('weight-carat-section');
    const diamondSec = document.getElementById('weight-diamond-section');

    if (gramSec) gramSec.style.setProperty('display', 'none', 'important');
    if (caratSec) caratSec.style.setProperty('display', 'none', 'important');
    if (diamondSec) diamondSec.style.setProperty('display', 'none', 'important');

    if (matLower.includes("vvs") || matLower.includes("si")) {
        if (diamondSec) diamondSec.style.setProperty('display', 'block', 'important');
    }
    else if (
        matLower.includes("emerald") ||
        matLower.includes("ruby") ||
        matLower.includes("sapphire") ||
        matLower.includes("pearl") ||
        matLower.includes("hessonite") ||
        matLower.includes("amethyst") ||
        matLower.includes("navratna") ||
        matLower.includes("manik") ||
        matLower.includes("oval") ||
        matLower.includes("gemstone")
    ) {
        if (caratSec) caratSec.style.setProperty('display', 'block', 'important');
    }
    else {
        if (gramSec) gramSec.style.setProperty('display', 'block', 'important');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const collection = document.getElementById('direct-collection');
    if (collection) {
        collection.addEventListener('change', toggleGemstoneView);
        toggleGemstoneView();
    }

    // Added an event listener to the material dropdown so that the weight box updates as soon as the material changes in "Other"
    const materialSelect = document.getElementById('direct-material');
    if (materialSelect) {
        materialSelect.addEventListener('change', updateWeightBasedOnMaterial);
    }
});




//price calculation//------------------------------------------
function calculatePrice() {
    // 1. Admin's manual rate input (This rate will now be considered for 1 Gram or 1 Carat)
    const rateInput = document.getElementById('manual-live-rate');
    let manualRate = (rateInput && rateInput.value) ? parseFloat(rateInput.value) : 0;

    const collection = document.getElementById('direct-collection') ? document.getElementById('direct-collection').value : "";

    const metalSelect = document.getElementById('direct-metal-type');
    const metal = metalSelect ? metalSelect.value : "";

    const material = document.getElementById('direct-material') ? document.getElementById('direct-material').value : "";

    let finalRate = 0;
    let weight = 0;
    let total = 0;

    // 2. Diamond Collection ya Metal Type Diamond hone par (Carat-based calculation)
    if (collection.includes("Diamond") || metal === "Diamond" || material.includes("Diamond")) {
        weight = parseFloat(document.getElementById('direct-diamond-carat').value) || 0;
        finalRate = manualRate; // Yahan manual rate seedha per carat rate ban jayega (Jaise 30,000)
        total = finalRate * weight; // e.g., 30000 * 1.25 = 37,500
    }
    // 3. Gemstone Collection or Metal Type Gemstone  (Carat-based calculation)
    else if (collection.includes("Gemstone") || metal === "Gemstone" || metal === "Gemstones" || material.includes("Gemstone")) {
        weight = parseFloat(document.getElementById('direct-carat').value) || 0;
        finalRate = manualRate > 0 ? manualRate : 1500; // If no rate is entered, default to 1500
        total = finalRate * weight; 
    }
    // 4. Gold, Silver & Other Collections (Gram-based calculation)
    else {
        weight = parseFloat(document.getElementById('direct-weight').value) || 0;

        if (material === "24K") finalRate = manualRate;
        else if (material === "22K") finalRate = manualRate * 0.916;
        else if (material === "18K") finalRate = manualRate * 0.75;
        else if (material === "14K") finalRate = manualRate * 0.58;
        else {
            finalRate = manualRate;
        }

        total = finalRate * weight;
    }

    // 5. Update UI Price Display
    const priceDisplay = document.getElementById('direct-price');
    if (priceDisplay) {
        priceDisplay.innerText = `₹ ${Math.round(total).toLocaleString('en-IN')}`;
    }
}


    //SETTING SECTION START//
    let loginAttempts = 0; // Counter for security

    function updateUsername() {
        var username = document.getElementById('newUsername').value;

        // Character limit check (minimum 5 characters)
        if (username.length < 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Security Requirement',
                text: 'Username must be at least 5 characters long!',
                confirmButtonColor: '#d4af37' // Ashok Jewellery Gold
            });
            return;
        }

        // Your SQL API call logic here
        console.log("Username updated to: " + username);

        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Username has been updated successfully!',
            timer: 3000,
            showConfirmButton: false,
            iconColor: '#d4af37'
        });
    }

    function changePassword() {
        var oldPass = document.getElementById('oldPassword').value;
        var newPass = document.getElementById('newPassword').value;
        var confirmPass = document.getElementById('confirmPassword').value;

        // 1. Check if Old Password is empty
        if (oldPass === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Input Required',
                text: 'Please enter your old password!',
                confirmButtonColor: '#d4af37'
            });
            return;
        }

        // 2. Password length check (minimum 6 characters)
        if (newPass.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Weak Password',
                text: 'New password must be at least 6 characters long.',
                confirmButtonColor: '#d4af37'
            });
            return;
        }

        // 3. Match check
        if (newPass !== confirmPass) {
            Swal.fire({
                icon: 'error',
                title: 'Mismatch',
                text: 'New Password and Confirm Password do not match!',
                confirmButtonColor: '#d4af37'
            });
            return;
        }

        // 4. API Call Placeholder (Success Message)
        Swal.fire({
            icon: 'success',
            title: 'Processing...',
            text: 'Sending password update request to Ashok Jewellery Art server.',
            timer: 2000,
            showConfirmButton: false,
            iconColor: '#d4af37'
        });

    }

    
async function saveAdminSettings() {
    let user = document.getElementById('newUsername').value.trim();
    let oldPass = document.getElementById('oldPassword').value.trim();
    let newPass = document.getElementById('newPassword').value.trim();
    let confirmPass = document.getElementById('confirmPassword').value.trim();

    // 1. Security: Hacking Warning
    if (failCount >= 7) {
        Swal.fire({
            icon: 'error',
            title: '⚠️ SECURITY ALERT',
            text: '7 failed attempts detected! System is monitoring this activity.',
            confirmButtonColor: '#d33'
        });
        return;
    }

    // 2. Check if ANY essential field is empty
    if (!user || !oldPass || !newPass || !confirmPass) {
        Swal.fire({
            icon: 'warning',
            title: 'All Fields Required!',
            text: 'Please fill in all the fields (Username, Old Password, New Password, Confirm Password).',
            confirmButtonColor: '#d4af37'
        });
        return;
    }

    // 3. Validation: New Password Length Check
    if (newPass.length < 8) {
        Swal.fire({
            icon: 'warning',
            title: 'Security Error',
            text: 'New password must be at least 8 characters long!',
            confirmButtonColor: '#d4af37'
        });
        return;
    }

    // 4. Validation: Password Match
    if (newPass !== confirmPass) {
        Swal.fire({
            icon: 'warning',
            title: 'Mismatch!',
            text: 'New password and Confirm password do not match!',
            confirmButtonColor: '#d4af37'
        });
        return;
    }

    let payload = {
        NewUsername: user,
        OldPassword: oldPass,
        NewPassword: newPass
    };

    try {
        const response = await fetch('/Admin/UpdateSettings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            failCount = 0;
            Swal.fire({
                icon: 'success',
                title: 'Settings Updated!',
                text: result.message,
                timer: 3000,
                showConfirmButton: false,
                iconColor: '#d4af37'
            });
        } else {
            failCount++;
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: result.message, 
                confirmButtonColor: '#d4af37'
            });
        }

        // Clear fields
        document.getElementById('newUsername').value = "";
        document.getElementById('oldPassword').value = "";
        document.getElementById('newPassword').value = "";
        document.getElementById('confirmPassword').value = "";

    } catch (error) {
        console.error("Fetch Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Could not connect to the server!',
            confirmButtonColor: '#d4af37'
        });
    }
}
    
    //---------------------//
let failCount = 0; // Hacking attempts counter

async function createNewAdminAccount() {
    let user = document.getElementById('createAdminUser').value;
    let pass = document.getElementById('createAdminPass').value;

    // 1. Validation Popup
    if (!user || !pass) {
        Swal.fire({
            icon: 'warning',
            title: 'All fields are Required!',
            text: 'Username and Password are Required.',
            confirmButtonColor: '#d4af37' // Ashok Jewellery Gold
        });
        return;
    }

    let payload = { NewUsername: user, NewPassword: pass };

    try {
        const response = await fetch('/Admin/CreateAdmin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // Check both response.ok AND backend's success flag / message
        if (response.ok && result.success !== false && !result.error) {
            Swal.fire({
                icon: 'success',
                title: 'Congratulations!',
                text: result.message || "Account Created Successfully!",
                timer: 3000,
                showConfirmButton: false,
                iconColor: '#d4af37'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.message || "Admin account already exists! You can only update it.",
                confirmButtonColor: '#d4af37'
            });
        }

    } catch (error) {
        console.error("Error:", error);

        Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Database connection failed!',
            confirmButtonColor: '#d4af37'
        });
    } finally {
        // Fields will ALWAYS clear here, no matter success, failure, or error!
        document.getElementById('createAdminUser').value = "";
        document.getElementById('createAdminPass').value = "";
    }
}

function toggleSettingTab(tabName) {
    const updateTab = document.getElementById('updateProfileTab');
    const createTab = document.getElementById('createNewAdminTab');

    if (tabName === 'update') {
        if (updateTab) updateTab.style.display = 'block';
        if (createTab) createTab.style.display = 'none';
        document.getElementById('btnTabUpdate').style.color = '#d4af37';
        document.getElementById('btnTabCreate').style.color = '#666';
    } else {
        if (updateTab) updateTab.style.display = 'none';
        if (createTab) createTab.style.display = 'block';
        document.getElementById('btnTabCreate').style.color = '#28a745';
        document.getElementById('btnTabUpdate').style.color = '#666';
    }
}
    //message pop-->
    document.addEventListener("DOMContentLoaded", function () {
        // Agar Index.cshtml se message mila hai, so popup 
        if (typeof loginSuccessMessage !== 'undefined' && loginSuccessMessage !== "") {
            Swal.fire({
                icon: 'success',
                title: 'Namaste!',
                text: loginSuccessMessage,
                timer: 3000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                iconColor: '#d4af37' // Gold Theme
            });
        }
    });



    //PRODUCT INVENTORY-UPDATE,DELETE

    // 1. DELETE FUNCTION
    function handleDelete(id) {
        // 1. Premium Confirmation Popup
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this item from Ashok Jewellery Art?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d4af37', // Gold Theme
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                // 2. Fetch Call to Backend
                fetch(`/Admin/DeleteInventory/${id}`, {
                    method: 'POST'
                })
                    .then(res => {
                        if (res.ok) {
                            // 3. Success Popup
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Item has been removed successfully.',
                                icon: 'success',
                                confirmButtonColor: '#d4af37'
                            }).then(() => {
                                location.reload(); // Page refresh
                            });
                        } else {
                            // 4. Failed Popup
                            Swal.fire({
                                title: 'Error!',
                                text: 'Delete failed. Please check the Product ID.',
                                icon: 'error',
                                confirmButtonColor: '#d4af37'
                            });
                        }
                    })
                    .catch(err => {
                        Swal.fire({
                            title: 'Server Error!',
                            text: 'Connection failed. Please try again.',
                            icon: 'error',
                            confirmButtonColor: '#d4af37'
                        });
                    });
            }
        });
}

// 2. UPDATE FUNCTION
function handleUpdate(id, currentName, currentWeight, currentPrice, currentMetal, currentCategory, currentQuality, currentGender) {
    console.log("Data Received:", { id, currentName, currentWeight, currentPrice, currentMetal, currentCategory, currentQuality, currentGender });

    Swal.fire({
        title: 'Update Product',
        html: `
        <div style="text-align: left; font-family: sans-serif;">
            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Product Name</label>
                <input id="swal-name" class="swal2-input" autocomplete="off" style="margin: 0; width: 100%; height: 35px;" value="${currentName}">
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Metal / Type</label>
                <select id="swal-metal" class="swal2-input" style="margin: 0; width: 100%; height: 35px;" onchange="updateQualityOptions(); calculateSwalPrice();">
                    <option value="Gold" ${currentMetal === 'Gold' ? 'selected' : ''}>Gold</option>
                    <option value="Silver" ${currentMetal === 'Silver' ? 'selected' : ''}>Silver</option>
                    <option value="Diamond" ${currentMetal === 'Diamond' ? 'selected' : ''}>Diamond</option>
                    <option value="Gemstone" ${currentMetal === 'Gemstone' ? 'selected' : ''}>Gemstone</option>
                    <option value="Rose Gold" ${currentMetal === 'Rose Gold' ? 'selected' : ''}>Rose Gold</option>
                </select>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Quality / Material Type</label>
                <select id="swal-quality" class="swal2-input" style="margin: 0; width: 100%; height: 35px;" onchange="calculateSwalPrice()">
                    <!-- Dynamic Options will load here -->
                </select>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Category / Collection</label>
                <select id="swal-category" class="swal2-input" style="margin: 0; width: 100%; height: 35px;">
                    <optgroup label="Gold Collection">
                        <option value="Gold Bangles" ${currentCategory === 'Gold Bangles' ? 'selected' : ''}>Gold Bangles</option>
                        <option value="Gold Chains" ${currentCategory === 'Gold Chains' ? 'selected' : ''}>Gold Chains</option>
                        <option value="Gents Rings" ${currentCategory === 'Gents Rings' ? 'selected' : ''}>Gents Rings</option>
                        <option value="Kids Bracelet" ${currentCategory === 'Kids Bracelet' ? 'selected' : ''}>Kids Bracelets</option>
                        <option value="Kids Mangati" ${currentCategory === 'Kids Mangati' ? 'selected' : ''}>Kids Mangati</option>
                        <option value="Gold Earring" ${currentCategory === 'Gold Earring' ? 'selected' : ''}>Gold Earrings</option>
                        <option value="Kids Ring" ${currentCategory === 'Kids Ring' ? 'selected' : ''}>Kids Rings</option>
                        <option value="Gold Mangalsutra" ${currentCategory === 'Gold Mangalsutra' ? 'selected' : ''}>Gold Mangalsutra</option>
                        <option value="Mangalsutra Pendants" ${currentCategory === 'Mangalsutra Pendants' ? 'selected' : ''}>Mangalsutra Pendants</option>
                        <option value="Gold Coins" ${currentCategory === 'Gold Coins' ? 'selected' : ''}>Gold Coins</option>
                        <option value="Ladies Rings" ${currentCategory === 'Ladies Rings' ? 'selected' : ''}>Ladies Rings</option>
                        <option value="Gold Bracelets" ${currentCategory === 'Gold Bracelets' ? 'selected' : ''}>Gold Bracelets</option>
                        <option value="Gold Pendants" ${currentCategory === 'Gold Pendants' ? 'selected' : ''}>Gold Pendants</option>
                        <option value="Gold Necklace" ${currentCategory === 'Gold Necklace' ? 'selected' : ''}>Gold Necklace</option>
                        <option value="Dorle Pendant" ${currentCategory === 'Dorle Pendant' ? 'selected' : ''}>Dorle Pendants</option>
                        <option value="Jhumka" ${currentCategory === 'Jhumka' ? 'selected' : ''}>Gold Jhumka</option>
                        <option value="Patta Mangalsutra" ${currentCategory === 'Patta Mangalsutra' ? 'selected' : ''}>Patta Mangalsutra</option>
                        <option value="Bridal Necklace" ${currentCategory === 'Bridal Necklace' ? 'selected' : ''}>Bridal Necklace</option>
                        <option value="Gold Tops" ${currentCategory === 'Gold Tops' ? 'selected' : ''}>Tops & Studs</option>
                        <option value="Nath" ${currentCategory === 'Nath' ? 'selected' : ''}>Nose Studs (Nath)</option>
                        <option value="Short Poth" ${currentCategory === 'Short Poth' ? 'selected' : ''}>Short Mangalsutra (Poth)</option>
                        <option value="Rounded Ring" ${currentCategory === 'Rounded Ring' ? 'selected' : ''}>Rounded Rings</option>
                        <option value="Ranihaar" ${currentCategory === 'Ranihaar' ? 'selected' : ''}>Ranihaar</option>
                        <option value="Laxmi Har" ${currentCategory === 'Laxmi Har' ? 'selected' : ''}>Laxmi Har</option>
                        <option value="Bormani Maal" ${currentCategory === 'Bormani Maal' ? 'selected' : ''}>Bormani-Maal</option>
                        <option value="Pohehaar" ${currentCategory === 'Pohehaar' ? 'selected' : ''}>Pohehaar</option>
                        <option value="Kanthi Choker" ${currentCategory === 'Kanthi Choker' ? 'selected' : ''}>Kanthi (Choker)</option>
                        <option value="EarChain" ${currentCategory === 'EarChain' ? 'selected' : ''}>EarChain (KAAN VEL)</option>
                        <option value="Nosepins" ${currentCategory === 'Nosepins' ? 'selected' : ''}>Nosepins</option>
                        <option value="Basket Earrings" ${currentCategory === 'Basket Earrings' ? 'selected' : ''}>Basket Earrings</option>
                        <option value="RoseGold Ring" ${currentCategory === 'RoseGold Ring' ? 'selected' : ''}>RoseGold Rings</option>
                    </optgroup>
                    <optgroup label="Silver Collection">
                        <option value="Silver Earrings" ${currentCategory === 'Silver Earrings' ? 'selected' : ''}>Silver Earrings</option>
                        <option value="Silver Utensils" ${currentCategory === 'Silver Utensils' ? 'selected' : ''}>Silver Utensils</option>
                        <option value="Pooja Items" ${currentCategory === 'Pooja Items' ? 'selected' : ''}>Pooja Items</option>
                        <option value="Silver Idol" ${currentCategory === 'Silver Idol' ? 'selected' : ''}>Silver Idol</option>
                        <option value="Silver Studs" ${currentCategory === 'Silver Studs' ? 'selected' : ''}>Silver Studs</option>
                        <option value="Silver Articles" ${currentCategory === 'Silver Articles' ? 'selected' : ''}>Silver Articles</option>
                        <option value="Silver Anklets" ${currentCategory === 'Silver Anklets' ? 'selected' : ''}>Silver Anklets</option>
                        <option value="Silver Karanda" ${currentCategory === 'Silver Karanda' ? 'selected' : ''}>Karanda (Kumkum Box)</option>
                        <option value="Silver Door Hanging" ${currentCategory === 'Silver Door Hanging' ? 'selected' : ''}>Door Hanging</option>
                        <option value="Silver Gents Rings" ${currentCategory === 'Silver Gents Rings' ? 'selected' : ''}>Silver Gents Ring</option>
                        <option value="Silver Ladies Rings" ${currentCategory === 'Silver Ladies Rings' ? 'selected' : ''}>Silver Ladies Rings</option>
                        <option value="Silver Kids Rings" ${currentCategory === 'Silver Kids Rings' ? 'selected' : ''}>Silver Kids Rings</option>
                        <option value="Silver Nosepins" ${currentCategory === 'Silver Nosepins' ? 'selected' : ''}>Silver Nosepins</option>
                        <option value="Silver Bracelets" ${currentCategory === 'Silver Bracelets' ? 'selected' : ''}>Silver Bracelets</option>
                        <option value="Silver Kids Bracelets" ${currentCategory === 'Silver Kids Bracelets' ? 'selected' : ''}>Silver Kids Bracelets</option>
                        <option value="Silver Pendants" ${currentCategory === 'Silver Pendants' ? 'selected' : ''}>Silver Pendants</option>
                        <option value="Silver Bangles" ${currentCategory === 'Silver Bangles' ? 'selected' : ''}>Silver Bangles</option>
                        <option value="Chain Anklets" ${currentCategory === 'Chain Anklets' ? 'selected' : ''}>Chain Anklets</option>
                        <option value="Silver Chains" ${currentCategory === 'Silver Chains' ? 'selected' : ''}>Silver Chains</option>
                        <option value="Silver Toe Rings" ${currentCategory === 'Silver Toe Rings' ? 'selected' : ''}>Toe Rings</option>
                        <option value="Silver Kambarpatta" ${currentCategory === 'Silver Kambarpatta' ? 'selected' : ''}>Kambarpatta</option>
                        <option value="Silver Krishna Saaj" ${currentCategory === 'Silver Krishna Saaj' ? 'selected' : ''}>Krishna Saaj</option>
                        <option value="Silver Karnful" ${currentCategory === 'Silver Karnful' ? 'selected' : ''}>Karnphool</option>
                        <option value="Silver Coins" ${currentCategory === 'Silver Coins' ? 'selected' : ''}>Silver Coins</option>
                    </optgroup>
                    <optgroup label="Diamond Collection">
                        <option value="Diamond Rings" ${currentCategory === 'Diamond Rings' ? 'selected' : ''}>Diamond Rings</option>
                        <option value="Diamond Earrings" ${currentCategory === 'Diamond Earrings' ? 'selected' : ''}>Diamond Earrings</option>
                        <option value="Diamond Bracelets" ${currentCategory === 'Diamond Bracelets' ? 'selected' : ''}>Diamond Bracelets</option>
                        <option value="Diamond Pendants" ${currentCategory === 'Diamond Pendants' ? 'selected' : ''}>Diamond Pendants</option>
                        <option value="Diamond Bangles" ${currentCategory === 'Diamond Bangles' ? 'selected' : ''}>Diamond Bangles</option>
                        <option value="Diamond Mangalsutra" ${currentCategory === 'Diamond Mangalsutra' ? 'selected' : ''}>Diamond Mangalsutra</option>
                    </optgroup>
                    <optgroup label="Gemstone Collection">
                        <option value="Gemstones" ${currentCategory === 'Gemstones' ? 'selected' : ''}>Gemstones</option>
                        <option value="Gemstone Rings" ${currentCategory === 'Gemstone Rings' ? 'selected' : ''}>Gemstone Rings</option>
                        <option value="Emerald Special" ${currentCategory === 'Emerald Special' ? 'selected' : ''}>Emerald Special</option>
                        <option value="Gemstone Pendants" ${currentCategory === 'Gemstone Pendants' ? 'selected' : ''}>Gemstone Pendants</option>
                        <option value="Gemstone Bracelets" ${currentCategory === 'Gemstone Bracelets' ? 'selected' : ''}>Gemstone Bracelets</option>
                    </optgroup>
                    <optgroup label="General Collections">
                        <option value="Gold" ${currentCategory === 'Gold' ? 'selected' : ''}>Gold Collection</option>
                        <option value="Silver" ${currentCategory === 'Silver' ? 'selected' : ''}>Silver Collection</option>
                        <option value="Gemstone" ${currentCategory === 'Gemstone' ? 'selected' : ''}>Gemstone Collection</option>
                        <option value="Diamond" ${currentCategory === 'Diamond' ? 'selected' : ''}>Diamond Collection</option>
                        <option value="Trending" ${currentCategory === 'Trending' ? 'selected' : ''}>Trending Collection</option>
                        <option value="DailyWear" ${currentCategory === 'DailyWear' ? 'selected' : ''}>Daily Wear Collection</option>
                        <option value="New Arrival" ${currentCategory === 'New Arrival' ? 'selected' : ''}>New Arrival</option>
                        <option value="1 Gram Gold" ${currentCategory === '1 Gram Gold' ? 'selected' : ''}>1 Gram Gold</option>
                        <option value="Bridal" ${currentCategory === 'Bridal' ? 'selected' : ''}>Bridal Collection</option>
                    </optgroup>
                </select>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Weight (Grams / Carats)</label>
                <input id="swal-weight" type="number" step="0.001" class="swal2-input" autocomplete="off" style="margin: 0; width: 100%; height: 35px;" value="${currentWeight}" oninput="calculateSwalPrice()">
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Gender</label>
                <select id="swal-gender" class="swal2-input" style="margin: 0; width: 100%; height: 35px;">
                    <option value="Women" ${currentGender === 'Women' ? 'selected' : ''}>Women</option>
                    <option value="Men" ${currentGender === 'Men' ? 'selected' : ''}>Men</option>
                    <option value="Kids" ${currentGender === 'Kids' ? 'selected' : ''}>Kids</option>
                    <option value="Unisex" ${currentGender === 'Unisex' ? 'selected' : ''}>Unisex</option>
                </select>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Gold/Silver/Diamond Rate (optional)</label>
                <input id="swal-manual-rate" type="number" class="swal2-input" autocomplete="off" style="margin: 0; width: 100%; height: 35px;" placeholder="Enter rate" oninput="calculateSwalPrice()">
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Price (₹)</label>
                <input id="swal-price" type="number" class="swal2-input" autocomplete="off" style="margin: 0; width: 100%; height: 35px;" value="${currentPrice}">
                <small id="price-msg" style="color: #d4af37; font-weight: bold; display: block; margin-top: 5px;"></small>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="font-weight: bold;">Update Image</label>
                <input id="swal-img" type="file" class="swal2-file" style="margin: 0; width: 100%;" accept="image/*">
            </div>
        </div>`,
        didOpen: () => {
            const metalSelect = document.getElementById('swal-metal');
            if (metalSelect) {
                metalSelect.value = currentMetal;
            }
            if (typeof updateQualityOptions === 'function') {
                updateQualityOptions(currentQuality);
            }
        },
        showCancelButton: true,
        confirmButtonColor: '#d4af37',
        confirmButtonText: 'Save Changes',
        preConfirm: () => {
            return {
                name: document.getElementById('swal-name').value,
                metal: document.getElementById('swal-metal').value,
                quality: document.getElementById('swal-quality').value,
                gender: document.getElementById('swal-gender').value,
                category: document.getElementById('swal-category').value,
                weight: document.getElementById('swal-weight').value,
                price: document.getElementById('swal-price').value,
                img: document.getElementById('swal-img').files[0]
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('name', result.value.name);
            formData.append('weight', result.value.weight);
            formData.append('price', result.value.price);
            formData.append('metalType', result.value.metal);
            formData.append('category', result.value.category);
            formData.append('MaterialType', result.value.quality);
            formData.append('pGender', result.value.gender);

            const isTrending = (result.value.category === "Trending") ? 1 : 0;
            const isNewArrival = (result.value.category === "New Arrival") ? 1 : 0;
            let isBridal = (result.value.category === "Bridal" || result.value.name.includes("Bridal")) ? 1 : 0;

            formData.append('isTrending', isTrending);
            formData.append('isNewArrival', isNewArrival);
            formData.append('isBridal', isBridal);
            formData.append('pSubCategory', result.value.name);

            if (result.value.img) {
                formData.append('updateImg', result.value.img);
            }

            fetch('/Admin/UpdateProduct', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    console.log("Server Response:", data);
                    if (data.success) {
                        Swal.fire({
                            title: 'Updated!',
                            icon: 'success',
                            timer: 800,
                            showConfirmButton: false
                        });


                        const targetRows = document.querySelectorAll(`[data-product-id="${id}"]`);

                        if (targetRows.length > 0) {
                            targetRows.forEach(targetRow => {
                                if (targetRow.tagName === 'TR') {
                                    if (targetRow.cells[4]) targetRow.cells[4].innerText = result.value.metal;
                                    if (targetRow.cells[5]) targetRow.cells[5].innerText = result.value.name;
                                    if (targetRow.cells[6]) targetRow.cells[6].innerText = result.value.weight;
                                    if (targetRow.cells[7]) targetRow.cells[7].innerText = '₹' + Number(result.value.price).toLocaleString();
                                    if (targetRow.cells[8]) targetRow.cells[8].innerText = result.value.category;
                                } else {
                                    const nameEl = targetRow.querySelector('.product-title, .title, h4, h5, strong, span');
                                    const priceEl = targetRow.querySelector('.product-price, .price, .amount');
                                    if (nameEl) nameEl.innerText = result.value.name;
                                    if (priceEl) priceEl.innerText = '₹' + Number(result.value.price).toLocaleString();
                                }

                                if (result.value.img) {
                                    const imgTag = targetRow.querySelector('img');
                                    if (imgTag) imgTag.src = URL.createObjectURL(result.value.img);
                                }

                                targetRow.style.transition = 'background-color 0.3s ease';
                                targetRow.style.backgroundColor = '#d4edda';
                                setTimeout(() => {
                                    targetRow.style.backgroundColor = '';
                                }, 1200);
                            });
                        } else {
                            location.reload();
                        }

                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                })
                .catch(err => {
                    console.error("Fetch Error:", err);
                    Swal.fire('Error', 'Something went wrong!', 'error');
                });
        }
    });
}

function updateSubCategories(selectedSubCat = '') {
    const collectionSelect = document.getElementById('swal-collection');
    const subCatSelect = document.getElementById('swal-subcategory');
    if (!collectionSelect || !subCatSelect) return;

    const collection = collectionSelect.value;
    subCatSelect.innerHTML = '';

    // Aapke HTML -all categories //
    const categoriesMap = {
        "Gold": [
            "Gold Bangles", "Gold Chains", "Gents Rings", "Kids Bracelet",
            "Kids Mangati", "Gold Earring", "Kids Ring", "Gold Mangalsutra",
            "Mangalsutra Pendants", "Gold Coins", "Ladies Rings", "Gold Bracelets",
            "Gold Pendants", "Gold Necklace", "Dorle Pendant", "Jhumka",
            "Patta Mangalsutra", "Bridal Necklace", "Gold Tops", "Nath",
            "Short Poth", "Rounded Ring", "Ranihaar", "Laxmi Har",
            "Bormani Maal", "Pohehaar", "Kanthi Choker", "EarChain",
            "Nosepins", "Basket Earrings", "RoseGold Ring"
        ],
        "Silver": [
            "Silver Earrings", "Silver Utensils", "Pooja Items", "Silver Idol",
            "Silver Studs", "Silver Articles", "Silver Anklets", "Silver Karanda",
            "Silver Door Hanging", "Silver Gents Rings", "Silver Ladies Rings",
            "Silver Kids Rings", "Silver Nosepins", "Silver Bracelets",
            "Silver Kids Bracelets", "Silver Pendants", "Silver Bangles",
            "Chain Anklets", "Silver Chains", "Silver Toe Rings", "Silver Kambarpatta",
            "Silver Krishna Saaj", "Silver Karnful", "Silver Coins"
        ],
        "Diamond": [
            "Diamond Rings", "Diamond Earrings", "Diamond Bracelets",
            "Diamond Pendants", "Diamond Bangles", "Diamond Mangalsutra"
        ],
        "Gemstone": [
            "Gemstones", "Gemstone Rings", "Emerald Special",
            "Gemstone Pendants", "Gemstone Bracelets"
        ],
        "Trending": ["Trending Collection"],
        "DailyWear": ["Daily Wear"],
        "New Arrival": ["New Arrival"]
    };

    const optionsList = categoriesMap[collection] || ["General"];

    optionsList.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        if (item === selectedSubCat || item === currentCategory) {
            opt.selected = true;
        }
        subCatSelect.appendChild(opt);
    });
}

// 2. RESTORE SCROLL POSITION & AUTO-SCROLL TO UPDATED ROW
document.addEventListener("DOMContentLoaded", function () {
    const pageScroll = sessionStorage.getItem('adminPageScroll');
    const containerScroll = sessionStorage.getItem('adminContainerScroll');
    const updatedId = sessionStorage.getItem('updatedProductId');

    // Restore Page Scroll
    if (pageScroll) {
        window.scrollTo(0, parseInt(pageScroll));
        sessionStorage.removeItem('adminPageScroll');
    }

    // Restore Container Scroll
    const scrollableDiv = document.querySelector('.table-responsive') || document.querySelector('table')?.parentElement;
    if (scrollableDiv && containerScroll) {
        scrollableDiv.scrollTop = parseInt(containerScroll);
        sessionStorage.removeItem('adminContainerScroll');
    }

    // Direct Focus on Updated Row if ID exists
    if (updatedId) {
        // Search by row ID or finding cell with product ID
        const rows = document.querySelectorAll('table tr');
        rows.forEach(row => {
            if (row.innerText.includes('#' + updatedId) || row.id === `product-row-${updatedId}`) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                row.style.backgroundColor = '#fff9c4';
                setTimeout(() => row.style.backgroundColor = '', 2500);
            }
        });
        sessionStorage.removeItem('updatedProductId');
    }
});
// Helper function modal ke dropdown ko update 
function updateQualityOptions(selectedVal = "") {
    const metalElement = document.getElementById('swal-metal');
    const qualitySelect = document.getElementById('swal-quality');
    if (!qualitySelect) return;

    const metal = metalElement ? metalElement.value : "";
    let options = "";

    if (metal === "Gold") {
        options = `
            <option value="24K">24K Gold</option>
            <option value="22K">22K Gold</option>
            <option value="18K">18K Gold</option>
            <option value="14K">14K Gold</option>
            <option value="10K">10K Gold</option>
            <option value="1 Gram Gold">1 Gram Gold</option>
        `;
    } else if (metal === "Silver") {
        options = `
            <option value="925 Sterling Silver">925 Sterling Silver</option>
            <option value="999 Pure Silver">999 Pure Silver</option>
            <option value="Normal Chandi">Normal Chandi</option>
            <option value="German Silver">German Silver</option>
            <option value="Silver Alloy">Silver Alloy</option>
        `;
    } else if (metal === "Diamond") {
        options = `
            <option value="VVS - EF">VVS - EF</option>
            <option value="VVS - FG">VVS - FG</option>
            <option value="SI - GH">SI - GH</option>
            <option value="SI - IJ">SI - IJ</option>
            <option value="IFI Certified">IFI Certified</option>
        `;
    } else if (metal === "Gemstone") {
        options = `
            <option value="Emerald (Panna)">Emerald (Panna)</option>
            <option value="Ruby (Manik / Manek)">Ruby (Manik / Manek)</option>
            <option value="Yellow Sapphire (Pukhraj)">Yellow Sapphire (Pukhraj)</option>
            <option value="Blue Sapphire (Neelam)">Blue Sapphire (Neelam)</option>
            <option value="Hessonite (Gomed)">Hessonite (Gomed)</option>
            <option value="Pearl (Moti)">Pearl (Moti)</option>
            <option value="Amethyst (Jamuniya)">Amethyst (Jamuniya)</option>
            <option value="Navratna (9 Gems)">Navratna (9 Gems)</option>
            <option value="Onyx Emerald">Onyx Emerald</option>
            <option value="Mangal Oval">Mangal Oval</option>
            <option value="Normal Manik">Normal Manik</option>
            <option value="High Quality Manik">High Quality Manik</option>
            <option value="Other Gemstone">Other Gemstone</option>
        `;
    } else if (metal === "Rose Gold") {
        options = `
            <option value="18K Rose Gold">18K Rose Gold</option>
            <option value="14K Rose Gold">14K Rose Gold</option>
            <option value="10K Rose Gold">10K Rose Gold</option>
        `;
    }

    qualitySelect.innerHTML = options;
    if (selectedVal) {
        qualitySelect.value = selectedVal;
    }
}
        //metal type->
        function handleCategoryChange() {
            var category = document.getElementById('direct-collection').value;
            var metalSection = document.getElementById('metal-type-section');

            // 1. Gemstone view toggle (Aapka purana logic)
            toggleGemstoneView();

            // 2. Metal dropdown logic
            // Agar collection Trending, New Arrival, DailyWear ya All Products -ask Metal 
            var collectionsWithMetal = ["Trending", "New Arrival", "DailyWear", "All Products"];

            if (collectionsWithMetal.includes(category)) {
                metalSection.style.display = 'block';
            } else {
                metalSection.style.display = 'none';
                document.getElementById('direct-metal-type').value = ""; // Reset value
            }
        }
    
function resetAdminForm() {
    // 1. Image and Preview Reset
    document.getElementById('direct-image').value = "";
    const preview = document.getElementById('direct-preview');
    if (preview) {
        preview.src = "";
        preview.classList.add('d-none');
    }

    const content = document.getElementById('preview-content');
    if (content) content.classList.remove('d-none');

    // 2. All Weight Inputs Reset
    document.getElementById('direct-title').value = "";
    document.getElementById('direct-weight').value = "";         // Grams
    document.getElementById('direct-carat').value = "";          // Gemstone Carat
    document.getElementById('direct-diamond-carat').value = "";  // Diamond Carat

    // 3. Rate and Price Reset
    const rateInput = document.getElementById('manual-live-rate');
    if (rateInput) rateInput.value = "";
    document.getElementById('direct-price').innerText = "₹ 0";

    // 4. UI State Reset
    const collectionSelect = document.getElementById('direct-collection');
    if (collectionSelect) {
        collectionSelect.selectedIndex = 0; // Default: Gold
        toggleGemstoneView(); 
    }
}

function calculateSwalPrice() {
    const metal = document.getElementById('swal-metal').value;
    const weight = parseFloat(document.getElementById('swal-weight').value) || 0;
    const manualRate = parseFloat(document.getElementById('swal-manual-rate').value) || 0; // Manual input se rate
    const priceInput = document.getElementById('swal-price');

    let finalRate = manualRate;

    if (finalRate === 0) {
        if (metal === "Gold") {
            const quality = document.getElementById('swal-quality').value;
            finalRate = (quality === "18K") ? parseFloat(document.getElementById('rate-18k')?.innerText || 0)
                : parseFloat(document.getElementById('rate-22k')?.innerText || 0);
        } else if (metal === "Silver") {
            finalRate = parseFloat(document.getElementById('rate-silver')?.innerText || 0);
        }
    }

    if (finalRate > 0 && weight > 0) {
        priceInput.value = Math.round(weight * finalRate);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const makingSelect = document.getElementById('calc-making-list');
    if (makingSelect) {
        makingSelect.innerHTML = "";
        for (let i = 1; i <= 100; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.text = i + "%";
            if (i === 10) option.selected = true; // Default 10%
            makingSelect.appendChild(option);
        }
    }
});

// 2. Auto-Calculate Logic: Har input/change  call 
function checkAutoCalc() {
    const autoToggle = document.getElementById('autoCalcToggle');
    if (autoToggle && autoToggle.checked) {
        calculateTotalEstimation();
    }
}

// 3. Main Calculation Function
function calculateTotalEstimation() {
    const rate = parseFloat(document.getElementById('calcCurrentRate').value) || 0;
    const weightSelect = document.getElementById('calcWeightSelect');
    const customWeightInput = document.getElementById('calcCustomWeight');
    const customWeight = parseFloat(customWeightInput.value) || 0;

    // Weight decide  (Custom ya Dropdown)
    let weight = (weightSelect.value === "custom") ? customWeight : (parseFloat(weightSelect.value) || 0);

    // Custom weight input show/hide
    if (weightSelect.value === "custom") {
        customWeightInput.style.display = "block";
    } else {
        customWeightInput.style.display = "none";
    }

    const making = parseFloat(document.getElementById('calc-making-list').value) || 0;

    // GST Percentage Fetch
    let gstPercent = getSelectedGSTPercentage();

    if (rate > 0 && weight > 0) {
        let goldValue = rate * weight;
        let makingAmt = (goldValue * making) / 100;
        let subtotal = goldValue + makingAmt;

        // FIXED: 'gst' ki jagah 'gstPercent' variable replace 
        let gstAmt = (subtotal * gstPercent) / 100;
        let total = Math.round(subtotal + gstAmt);

        // Result Update
        const priceDisplay = document.getElementById('finalPriceDisplay');
        if (priceDisplay) {
            priceDisplay.innerText = "₹ " + total.toLocaleString('en-IN') + ".00";
        }

        const resultBox = document.getElementById('calcResult');
        if (resultBox) {
            resultBox.style.display = "block";
            // Animation Reset
            resultBox.classList.remove('show-estimate');
            void resultBox.offsetWidth; // Reflow trigger
            resultBox.classList.add('show-estimate');
        }
    } else {
        if (window.event && window.event.type === 'click') {
            alert("Please enter valid Gold Rate and Weight.");
        }
    }
}



// 4. Reset Function
function resetCalculator() {
    // 1. Gold Rate Reset
    document.getElementById('calcCurrentRate').value = "";

    // 2. Weight Inputs Reset
    document.getElementById('calcWeightSelect').value = "1";
    document.getElementById('calcCustomWeight').value = "";
    document.getElementById('calcCustomWeight').style.display = "none";

    // 3. GST Inputs Reset (Dropdown + Custom Input + Wrapper Container)
    document.getElementById('calcGST').value = "3";

    const customGstInput = document.getElementById('calcCustomGST');
    if (customGstInput) {
        customGstInput.value = "";
    }

    const customGstContainer = document.getElementById('customGstContainer');
    if (customGstContainer) {
        customGstContainer.style.display = "none";
    }

    // 4. Auto Calc Toggle Reset
    const autoToggle = document.getElementById('autoCalcToggle');
    if (autoToggle) {
        autoToggle.checked = false;
    }

    // 5. Result Display Box Hide & Reset
    const resultBox = document.getElementById('calcResult');
    if (resultBox) {
        resultBox.style.display = "none";
        resultBox.classList.remove('show-estimate');
    }

    console.log("Calculator reset successfully!");
}
//-----------------------------------------MULTI PRODUCTS SECTION START-----------------------------------------------//

// Array to store chosen files globally for upload
let selectedBulkFiles = [];

// 1. Tab Navigation Trigger
function showMultiProducts() { 
    var calc = document.getElementById('calculatorSection');
    var inv = document.getElementById('productInventorySection');
    var ord = document.getElementById('ordersSection');
    var sett = document.getElementById('settingsSection');
    var multi = document.getElementById('multiProductsSection');
    var multiInv = document.getElementById('multiInventorySection'); // Multi ka Inventory Table

    if (calc) calc.style.display = 'none';
    if (inv) inv.style.display = 'none';
    if (ord) ord.style.display = 'none';
    if (sett) sett.style.display = 'none';

    // only show Multi-Products and their inventory 
    if (multi) multi.style.display = 'block';
    if (multiInv) multiInv.style.display = 'block';

    updateActiveLink('multiProductsSection');
}

// 1. Quality / Material Options Generate
function updateMultiQualityOptions() {
    let collection = document.getElementById("multi-collection").value.toLowerCase();
    let optionsHtml = "";

    if (collection.includes("diamond")) {
        optionsHtml = `
            <option value="VVS-EF">VVS - EF (Diamond)</option>
            <option value="VVS-FG">VVS - FG (Diamond)</option>
            <option value="SI-GH">SI - GH (Diamond)</option>
            <option value="SI-IJ">SI - IJ (Diamond)</option>
        `;
    } else if (collection.includes("gemstone") || collection.includes("emerald") || collection.includes("ruby") || collection.includes("sapphire") || collection.includes("pearl") || collection.includes("navratna") || collection.includes("pukhraj") || collection.includes("neelam")) {
        optionsHtml = `
            <option value="Emerald">Emerald (Panna)</option>
            <option value="Ruby">Ruby (Manik / Manek)</option>
            <option value="Yellow Sapphire">Yellow Sapphire (Pukhraj)</option>
            <option value="Blue Sapphire">Blue Sapphire (Neelam)</option>
            <option value="Hessonite">Hessonite (Gomed)</option>
            <option value="Pearl">Pearl (Moti)</option>
            <option value="Amethyst">Amethyst (Jamuniya)</option>
            <option value="Navratna">Navratna (9 Gems)</option>
            <option value="Onyx/Emerald">Onyx Emerald</option>
            <option value="Mangal Oval">Mangal Oval</option>
            <option value="Normal Manik">Normal Manik</option>
            <option value="High Manik">High Quality Manik</option>
            <option value="Other Gemstone">Other Gemstone</option>
        `;
    } else if (collection.includes("silver")) {
        optionsHtml = `
            <option value="925 Silver">925 Sterling Silver</option>
            <option value="999 Silver">999 Pure Silver</option>
            <option value="Chandi">Normal Chandi</option>
        `;
    } else {
        optionsHtml = `
            <option value="24K">24K Gold</option>
            <option value="22K" selected>22K Gold</option>
            <option value="18K">18K Gold</option>
            <option value="14K">14K Gold</option>
             <option value="10K">10K Gold</option>
            <option value="1 Gram Gold">1 Gram Gold</option>
            <option value="Other">Other (Manual)</option>
        `;
    }

    document.querySelectorAll(".bulk-material").forEach(select => {
        select.innerHTML = optionsHtml;
    });
}

// 2. When the collection changes, weights, units, and materials will be updated.
function handleMultiCollectionChange() {
    let rawCollection = document.getElementById("multi-collection").value;
    let collection = rawCollection.toLowerCase();
    let weightLabel = "Grams (g)";
    let unitTag = "g";

    let mainMaterialSelect = document.getElementById("multi-material");
    let mainMaterialOptions = "";

    if (collection.includes("diamond")) {
        mainMaterialOptions = `
            <option value="VVS-EF">VVS - EF (Diamond)</option>
            <option value="VVS-FG">VVS - FG (Diamond)</option>
            <option value="SI-GH">SI - GH (Diamond)</option>
            <option value="SI-IJ">SI - IJ (Diamond)</option>
        `;
    } else if (collection.includes("gemstone") || collection.includes("emerald") || collection.includes("ruby") || collection.includes("sapphire") || collection.includes("pearl") || collection.includes("navratna") || collection.includes("pukhraj") || collection.includes("neelam")) {
        mainMaterialOptions = `
            <option value="Emerald">Emerald (Panna)</option>
            <option value="Ruby">Ruby (Manik / Manek)</option>
            <option value="Yellow Sapphire">Yellow Sapphire (Pukhraj)</option>
            <option value="Blue Sapphire">Blue Sapphire (Neelam)</option>
            <option value="Hessonite">Hessonite (Gomed)</option>
            <option value="Pearl">Pearl (Moti)</option>
            <option value="Amethyst">Amethyst (Jamuniya)</option>
            <option value="Navratna">Navratna (9 Gems)</option>
            <option value="Onyx/Emerald">Onyx Emerald</option>
            <option value="Mangal Oval">Mangal Oval</option>
            <option value="Normal Manik">Normal Manik</option>
            <option value="High Manik">High Quality Manik</option>
            <option value="Other Gemstone">Other Gemstone</option>
        `;
    } else if (collection.includes("silver")) {
        mainMaterialOptions = `
            <option value="925 Silver">925 Sterling Silver</option>
            <option value="999 Silver">999 Pure Silver</option>
            <option value="Chandi">Normal Chandi</option>
        `;
    } else {
        mainMaterialOptions = `
            <option value="24K">24K Gold</option>
            <option value="22K" selected>22K Gold</option>
            <option value="18K">18K Gold</option>
            <option value="14K">14K Gold</option>
            <option value="10K">10K Gold</option>
            <option value="1 Gram Gold">1 Gram Gold</option>
            <option value="Other">Other (Manual)</option>
        `;
    }

    if (mainMaterialSelect) {
        mainMaterialSelect.innerHTML = mainMaterialOptions;
    }

    if (collection.includes("diamond") || collection.includes("gemstone") || collection.includes("emerald") || collection.includes("ruby") || collection.includes("sapphire") || collection.includes("pearl") || collection.includes("navratna")) {
        weightLabel = "Carats (ct)";
        unitTag = "ct";
    }

    let masterLabel = document.getElementById("multi-weight-label");
    if (masterLabel) {
        if (weightLabel.includes("Carats")) {
            masterLabel.innerText = "APPLY SAME WEIGHT (Carats - ct)";
            masterLabel.style.color = "#9c27b0";
        } else {
            masterLabel.innerText = "APPLY SAME WEIGHT (Grams - g)";
            masterLabel.style.color = "#d4af37";
        }
    }

    document.querySelectorAll(".dynamic-weight-label").forEach(lbl => lbl.innerText = `WEIGHT (${weightLabel.toUpperCase()})`);
    document.querySelectorAll(".dynamic-unit-tag").forEach(span => span.innerText = unitTag);

    updateMultiQualityOptions();
}

// 3. Process Selected Images & Build Cards 
function processBulkImages(event) {
    const files = event.target.files;
    const container = document.getElementById("bulk-cards-container");

    let collection = document.getElementById("multi-collection").value;
    let weightText = (collection.includes("Diamond") || collection.includes("Gemstone")) ? "WEIGHT (CARATS - CT)" : "WEIGHT (G)";
    let unitTag = (collection.includes("Diamond") || collection.includes("Gemstone")) ? "ct" : "g";

    // 1. Master weight value get 
    const masterWeightVal = document.getElementById("masterWeightInput") ? document.getElementById("masterWeightInput").value : "";

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileIndex = selectedBulkFiles.length;
        selectedBulkFiles.push(file);

        // 2. Card HTML jisme only weight value set , rate empty
        const cardHtml = `
<div class="col-12 mb-3 bulk-card-item" id="bulk-card-${fileIndex}">
    <div class="card shadow-sm border-0" style="border: 1px solid #eee !important; border-radius: 10px; background: #fff; overflow: hidden;">
        <div style="display: flex; align-items: flex-start; padding: 15px; gap: 20px;">
            <div style="flex: 0 0 150px; height: 150px; background: #f9f9f9; border-radius: 8px; position: relative; border: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: center;">
                <img src="${URL.createObjectURL(file)}" style="width: 100%; height: 100%; object-fit: contain; padding: 5px;">
                <button onclick="removeBulkItem(${fileIndex})" 
                        style="position: absolute; top: -8px; left: -8px; background: #ff4d4d; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-size: 14px; cursor: pointer;">&times;</button>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <div>
                    <label class="dynamic-weight-label" style="font-size: 10px; font-weight: bold; color: #888;">${weightText}</label>
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control form-control-sm bulk-weight" data-index="${fileIndex}" value="${masterWeightVal}" oninput="calculateBulkRowPrice(this)" placeholder="0.000" step="any">
                        <span class="input-group-text dynamic-unit-tag">${unitTag}</span>
                    </div>
                </div>
                <div style="max-width: 180px; width: 100%; margin-bottom: 5px;">
                    <label style="font-size: 10px; font-weight: bold; color: #888; margin-bottom: 2px; display: block;">MATERIAL / QUALITY</label>
                    <select class="form-select form-select-sm bulk-material" 
                            style="height: 30px; 
                                   width: 180px !important; 
                                   min-width: 180px !important; 
                                   max-width: 180px !important; 
                                   font-size: 12px; 
                                   padding: 0 5px;">
                    </select>
                </div>
                <div>
                    <label style="font-size: 10px; font-weight: bold; color: #888;">MARKET RATE</label>
                    <input type="number" class="form-control form-control-sm bulk-rate" data-index="${fileIndex}" oninput="calculateBulkRowPrice(this)" placeholder="Rate">
                </div>
                <div>
                    <label style="font-size: 10px; font-weight: bold; color: #888;">FINAL PRICE</label>
                    <input type="number" class="form-control form-control-sm bulk-total" data-index="${fileIndex}" readonly>
                </div>
            </div>
        </div>
    </div>
</div>`;
        container.insertAdjacentHTML('beforeend', cardHtml);
    }

    updateMultiQualityOptions();


    document.getElementById("bulk-actions-row").classList.remove("d-none");
}  


function calculateBulkRowPrice(element) {
    const row = element.closest('.bulk-card-item');

    //  row - inputs catch
    const weight = parseFloat(row.querySelector('.bulk-weight').value) || 0;
    const rate = parseFloat(row.querySelector('.bulk-rate').value) || 0;
    const totalInput = row.querySelector('.bulk-total');

    if (weight > 0 && rate > 0) {
        // Simple multiplication (Weight * Rate)
        const total = Math.round(weight * rate);

        totalInput.value = total;
    } else {
        totalInput.value = ""; 
    }
}

// Card remove  handler
function removeBulkItem(index) {
    document.getElementById(`bulk-card-${index}`).remove();


    selectedBulkFiles[index] = null;


    if (document.querySelectorAll("#bulk-cards-container .col-md-6").length === 0) {
        document.getElementById("bulk-actions-row").classList.add("d-none");
    }
}



async function uploadBulkProducts() {
    try {
        const formData = new FormData();
        const cards = document.querySelectorAll(".bulk-card-item");

        console.log("Total cards found:", cards.length);

        // Global Fields 
        const titleEl = document.getElementById("multi-title");
        const collEl = document.getElementById("multi-collection");
        const metalEl = document.getElementById("multi-metal-type");
        const genderEl = document.getElementById("multi-gender");

        formData.append("ProductTitle", titleEl ? titleEl.value.trim() : "");
        formData.append("Collection", collEl ? collEl.value : "");
        formData.append("MetalType", metalEl ? metalEl.value : "");
        formData.append("Gender", genderEl ? genderEl.value : "");

        let index = 0;
        cards.forEach((card) => {
            const weight = card.querySelector(".bulk-weight")?.value;
            const material = card.querySelector(".bulk-material")?.value;
            const price = card.querySelector(".bulk-total")?.value;

            // String Number me convert
            const fileIdx = parseInt(card.id.replace("bulk-card-", ""), 10);
            const file = selectedBulkFiles ? selectedBulkFiles[fileIdx] : null;

            console.log(`Card index ${fileIdx} -> File found:`, !!file, "| Weight:", weight);

            if (file && weight) {
                formData.append(`Products[${index}].Weight`, weight);
                formData.append(`Products[${index}].MaterialType`, material);
                formData.append(`Products[${index}].EstimatedPrice`, price);
                formData.append(`Products[${index}].ProductImage`, file);
                index++;
            }
        });

        console.log("Valid products to upload count:", index);

        if (index === 0) {
            Swal.fire({
                title: 'Action Required',
                text: 'Please enter weight and select image for at least one product.',
                icon: 'warning',
                confirmButtonColor: '#d4af37'
            });
            return;
        }

        Swal.fire({
            title: 'Uploading...',
            text: 'Saving products to Ashok Jewellery Art',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        const response = await fetch('/Admin/UploadBulkProducts', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {


            sessionStorage.setItem('activeSection', 'multiProductsSection');

            Swal.fire({
                title: 'Success!',
                text: 'All products have been added to inventory.',
                icon: 'success',
                confirmButtonColor: '#d4af37'
            }).then(() => location.reload());
        }
 else {
            Swal.fire('Error', result.message, 'error');
        }
    } catch (err) {
        console.error("Upload Error:", err); 
        Swal.fire('Server Error', 'Something went wrong on the client side or network!', 'error');
    }
}



//weight logic
function applyWeightToAll() {

    // 1. common box  value

    var commonValue = document.getElementById("commonWeightInput").value.trim();

    if (commonValue === "") {
        alert("Pehle weight toh daalo bhai!");
        return;
    }

    // 2. weight inputs
    var weightInputs = document.querySelectorAll('.product-weight');

    if (weightInputs.length === 0) {
        console.error("Koi product row nahi mili!");
        return;
    }

    // 3. value fill 
    weightInputs.forEach(function (input) {
        input.value = commonValue;
    });

    console.log("Weight applied to all rows!");
}

function applyWeightToAllRows(masterInput) {
    var weightValue = masterInput.value;


    var allWeightInputs = document.querySelectorAll('.bulk-weight, #bulk-cards-container input[type="number"]');

    allWeightInputs.forEach(function (input) {
        input.value = weightValue;


        if (typeof calculateBulkRowPrice === "function") {
            calculateBulkRowPrice(input);
        }
    });
}

    function toggleLocationDrawer() {
                                var drawer = document.getElementById("locationDrawer");

    if (drawer.style.left === "-450px" || drawer.style.left === "") {
       
        drawer.style.left = "260px";
                                } else {
        drawer.style.left = "-450px";
                                }
}


function updateMultiQualityOptionsByMetal() {
    const metalElement = document.getElementById('multi-metal-type');
    const mainMaterialSelect = document.getElementById("multi-material");
    if (!metalElement || !mainMaterialSelect) return;

    const metal = metalElement.value;
    let optionsHtml = "";
    let weightLabel = "Grams (g)";
    let unitTag = "g";

    if (metal === "Gold") {
        optionsHtml = `
            <option value="24K Gold">24K Gold</option>
            <option value="22K Gold" selected>22K Gold</option>
            <option value="18K Gold">18K Gold</option>
            <option value="14K Gold">14K Gold</option>
            <option value="10K Gold">10K Gold</option>
            <option value="1 Gram Gold">1 Gram Gold</option>
        `;
    } else if (metal === "Silver") {
        optionsHtml = `
            <option value="925 Sterling Silver">925 Sterling Silver</option>
            <option value="999 Pure Silver">999 Pure Silver</option>
            <option value="Normal Chandi">Normal Chandi</option>
            <option value="German Silver">German Silver</option>
            <option value="Silver Alloy">Silver Alloy</option>
        `;
    } else if (metal === "Diamond") {
        optionsHtml = `
            <option value="VVS-EF">VVS - EF (Sabse Saaf - White)</option>
            <option value="VVS-FG">VVS - FG (Premium Quality)</option>
            <option value="SI-GH">SI - GH (Standard)</option>
            <option value="SI-IJ">SI - IJ (Budget Quality)</option>
        `;
        weightLabel = "Carats (ct)";
        unitTag = "ct";
    } else if (metal === "Gemstone") {
        optionsHtml = `
            <option value="Emerald (Panna)">Emerald (Panna)</option>
            <option value="Ruby (Manik / Manek)">Ruby (Manik / Manek)</option>
            <option value="Yellow Sapphire (Pukhraj)">Yellow Sapphire (Pukhraj)</option>
            <option value="Blue Sapphire (Neelam)">Blue Sapphire (Neelam)</option>
            <option value="Hessonite (Gomed)">Hessonite (Gomed)</option>
            <option value="Pearl (Moti)">Pearl (Moti)</option>
            <option value="Amethyst (Jamuniya)">Amethyst (Jamuniya)</option>
            <option value="Navratna (9 Gems)">Navratna (9 Gems)</option>
            <option value="Onyx Emerald">Onyx Emerald</option>
            <option value="Mangal Oval">Mangal Oval</option>
            <option value="Normal Manik">Normal Manik</option>
            <option value="High Quality Manik">High Quality Manik</option>
            <option value="Other Gemstone">Other Gemstone</option>
        `;
        weightLabel = "Carats (ct)";
        unitTag = "ct";
    } else if (metal === "Rose Gold") {
        optionsHtml = `
         <option value="24K Rose Gold">24K Rose Gold</option>
        <option value="18K Rose Gold">18K Rose Gold</option>
            <option value="14K Rose Gold">14K Rose Gold</option>
            <option value="10K Rose Gold">10K Rose Gold</option>
        `;
    } else {
        optionsHtml = `
            <option value="24K Gold">24K Gold</option>
            <option value="22K Gold" selected>22K Gold</option>
            <option value="18K Gold">18K Gold</option>
<option value="14K Gold">14K Gold</option>
<option value="10K Gold">10K Gold</option>
            <option value="Other">Other (Manual)</option>
        `;
    }

    // Master material dropdown update 

    const masterMaterialSelect = document.getElementById("multi-material");
    const currentSelectedVal = masterMaterialSelect ? masterMaterialSelect.value : "";

    if (masterMaterialSelect) {
        masterMaterialSelect.innerHTML = optionsHtml;
        if (currentSelectedVal) {
            masterMaterialSelect.value = currentSelectedVal; 
        }
    }

    // 2. bulk cards  material dropdowns update -value set 

    const currentMasterVal = mainMaterialSelect.value;
    document.querySelectorAll(".bulk-material").forEach(select => {
        select.innerHTML = optionsHtml;
        select.value = currentMasterVal;
    });

    // Weight label and unit tag update  (Grams vs Carats)
    let masterLabel = document.getElementById("multi-weight-label");
    if (masterLabel) {
        if (weightLabel.includes("Carats")) {
            masterLabel.innerText = "APPLY SAME WEIGHT (Carats - ct)";
            masterLabel.style.color = "#9c27b0";
        } else {
            masterLabel.innerText = "APPLY SAME WEIGHT (Grams - g)";
            masterLabel.style.color = "#d4af37";
        }
    }

    document.querySelectorAll(".dynamic-weight-label").forEach(lbl => lbl.innerText = `WEIGHT (${weightLabel.toUpperCase()})`);
    document.querySelectorAll(".dynamic-unit-tag").forEach(span => span.innerText = unitTag);
}

//-------------------------//
document.addEventListener('DOMContentLoaded', function () {

    if (sessionStorage.getItem('activeSection') === 'multiProductsSection') {

        switchSection('multiProductsSection');


        sessionStorage.removeItem('activeSection');
    }


    const multiMetalSelect = document.getElementById('multi-metal-type');
    if (multiMetalSelect) {
        multiMetalSelect.addEventListener('change', updateMultiQualityOptionsByMetal);
    }

    const multiCollection = document.getElementById('multi-collection');
    if (multiCollection) {
        multiCollection.addEventListener('change', handleMultiCollectionChange);
    }
});
//----------------------------------------------------------------------------------------------------------//
//********FOR DROPDOWN ------------*/
// Dropdown Click Handle Logic
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector(".today-rates-btn");
    const dropdown = document.querySelector(".rate-dropdown-content");

    if (btn && dropdown) {
        // Force fully CSS hover disable 
        dropdown.style.display = "none";

        // 1. Button Click Handler
        btn.addEventListener("click", function (e) {
            e.stopPropagation(); // Event ko spread 

            // Toggle Display
            if (dropdown.style.display === "none" || dropdown.style.display === "") {
                dropdown.style.setProperty("display", "block", "important");
            } else {
                dropdown.style.setProperty("display", "none", "important");
            }
        });

        // 2. Dropdown click dropdown
        dropdown.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        // 3. Screen - click  dropdown 
        document.addEventListener("click", function () {
            dropdown.style.setProperty("display", "none", "important");
        });
    }
});

//---------------WEIGHT DROPDOWN LIST--------------------//
// Function to handle Dropdown Change & Show/Hide Custom Weight Box
function toggleCustomWeightInput() {
    const weightSelect = document.getElementById("calcWeightSelect");
    const customWeightInput = document.getElementById("calcCustomWeight");

    if (weightSelect.value === "custom") {
        // Dropdown - Custom 
        customWeightInput.style.display = "block";
        customWeightInput.focus();
    } else {
        // Standard Option - Box 
        customWeightInput.style.display = "none";
        customWeightInput.value = ""; // Clear custom input
    }

    // Direct calculation update
    checkAutoCalc();
}

// Function to get current weight (Call this inside your main price calculation function)
function getSelectedWeight() {
    const weightSelect = document.getElementById("calcWeightSelect");
    const customWeightInput = document.getElementById("calcCustomWeight");

    if (weightSelect && weightSelect.value === "custom") {
        return parseFloat(customWeightInput.value) || 0;
    } else if (weightSelect) {
        return parseFloat(weightSelect.value) || 0;
    }
    return 0;
}
//-------------------------GST CHARGES-------------------------------------------//
// Dropdown change hone par Custom GST Container show/hide karein
function toggleCustomGSTInput() {
    const gstSelect = document.getElementById("calcGST");
    const customGstContainer = document.getElementById("customGstContainer");
    const customGstInput = document.getElementById("calcCustomGST");

    if (gstSelect.value === "custom") {
        customGstContainer.style.display = "block";
        customGstInput.focus();
    } else {
        customGstContainer.style.display = "none";
        customGstInput.value = ""; // Reset input
    }

    // Calculation refresh
    if (typeof calculateTotalEstimation === "function") {
        calculateTotalEstimation();
    }
}

// Active GST % fetch  function//
function getSelectedGSTPercentage() {
    const gstSelect = document.getElementById('calcGST');
    const customGstInput = document.getElementById('calcCustomGST');

    if (gstSelect && gstSelect.value === "custom") {
        return parseFloat(customGstInput.value) || 0;
    } else if (gstSelect) {
        return parseFloat(gstSelect.value) || 0;
    }
    return 0;
}

//TODATS RATES USING API-------------------------------------//

// MetalAPI Key CALL//
document.addEventListener("DOMContentLoaded", function () {
    // 1. Dropdown Toggle Engine
    try {
        const btn = document.querySelector(".today-rates-btn");
        const content = document.querySelector(".rate-dropdown-content");

        if (btn && content) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                content.style.display = (content.style.display === "block") ? "none" : "block";
            });

            document.addEventListener("click", function (e) {
                if (!btn.contains(e.target) && !content.contains(e.target)) {
                    content.style.display = "none";
                }
            });
        }
    } catch (err) {
        console.error("Dropdown error:", err);
    }

    // 2. Multi-Level Safe Fetch Function
    async function FetchGoldRates() {
        let rawData = null;
        let apiUsageCount = parseInt(localStorage.getItem("metal_api_usage_count") || "0");

        // Attempt 1: MetalAPI (Ab yeh direct call karne ke bajaye hamare C# backend ko hit karega)
        if (apiUsageCount < 100) {
            try {
                let res = await fetch('/Admin/GetMetalRates');
                if (res.ok) {
                    rawData = await res.json();
                    localStorage.setItem("metal_api_usage_count", apiUsageCount + 1);
                }
            } catch (err) {
                console.warn("MetalAPI Failed/Expired. Auto-switching to Free Market Feed...", err);
            }
        }

        // Attempt 2: Free Open Feed (Unlimited Backup)
        if (!rawData || (!rawData.rates && !rawData.data)) {
            try {
                let res = await fetch("https://open.er-api.com/v6/latest/USD");
                rawData = await res.json();
            } catch (err) {
                console.error("Backup API failed", err);
            }
        }

        // Attempt 3: Calculation & Hardcoded Safety Fallback
        try {
            let rateObj = {};

            if (rawData && rawData.rates) {
                let inrRate = rawData.rates.INR || 86.5;
                let goldOunce = rawData.rates.XAU ? (1 / rawData.rates.XAU) : 2700;
                let silverOunce = rawData.rates.XAG ? (1 / rawData.rates.XAG) : 30;

                let base24kGram = (goldOunce * inrRate) / 31.1035;
                let live24k = Math.round(base24kGram * 1.73);
                let liveSilver = Math.round(((silverOunce * inrRate) / 31.1035) * 2.55);

                rateObj = {
                    gold24: live24k,
                    gold22: Math.round(live24k * 0.9167),
                    gold18: Math.round(live24k * 0.7500),
                    gold14: Math.round(live24k * 0.5833),
                    silver: liveSilver
                };
            } else {
                // Hardcoded Safety Fallback ( Internet/APIs )
                rateObj = {
                    gold24: 14510,
                    gold22: 13301,
                    gold18: 10883,
                    gold14: 8464,
                    silver: 238
                };
            }

            // Fill Values on UI
            if (document.getElementById("rate24")) document.getElementById("rate24").innerText = "₹" + rateObj.gold24.toLocaleString('en-IN');
            if (document.getElementById("rate22")) document.getElementById("rate22").innerText = "₹" + rateObj.gold22.toLocaleString('en-IN');
            if (document.getElementById("rate18")) document.getElementById("rate18").innerText = "₹" + rateObj.gold18.toLocaleString('en-IN');
            if (document.getElementById("rate14")) document.getElementById("rate14").innerText = "₹" + rateObj.gold14.toLocaleString('en-IN');
            if (document.getElementById("rateSilver")) document.getElementById("rateSilver").innerText = "₹" + rateObj.silver.toLocaleString('en-IN');

        } catch (uiErr) {
            console.error("UI Render Error:", uiErr);
        }
    }

    FetchGoldRates();
});

//-------------------------TOTAL ITEMS------------------------------------------------------------------//
function updateLiveTotalCount() {
    // Sirf visible/active rows - count //
    const visibleRows = document.querySelectorAll("#invTable tbody tr");
    const countBadge = document.getElementById("totalCount");

    if (countBadge) {
        countBadge.textContent = visibleRows.length;
    }
}

//  page load //
document.addEventListener("DOMContentLoaded", function () {
    updateLiveTotalCount();
});

// 1. Corrected & Cleaned clearBulkSection Function
function clearBulkSection() {
    // Image input aur cards container  clear 
    const imageInput = document.getElementById('bulk-images-input');
    if (imageInput) imageInput.value = '';

    const cardsContainer = document.getElementById('bulk-cards-container');
    if (cardsContainer) cardsContainer.innerHTML = '';

    // Action buttons row hide karein
    const actionsRow = document.getElementById('bulk-actions-row');
    if (actionsRow) actionsRow.classList.add('d-none');

    // Inputs and fields reset karein
    const multiTitle = document.getElementById('multi-title');
    if (multiTitle) multiTitle.value = '';

    const masterWeight = document.getElementById('masterWeightInput');
    if (masterWeight) masterWeight.value = '';

    // --- NAYA CODE: Dropdowns aur  fields ko default  reset karne  ---
    const multiCollection = document.getElementById('multi-collection');
    if (multiCollection) {
        multiCollection.selectedIndex = 0; 


        if (typeof handleMultiCollectionChange === 'function') {
            handleMultiCollectionChange();
        }
    }

    const multiGender = document.getElementById('multi-gender'); 
    if (multiGender) multiGender.selectedIndex = 0;

    const multiMaterial = document.getElementById('multi-material');
    if (multiMaterial) multiMaterial.selectedIndex = 0;
    // -----------------------------------------------------------------------------

    // Global selected files array ko zaroor clear karein
    selectedBulkFiles = [];
    console.log("Bulk section cleared successfully!");
}

// 2. Fixed Page Load Scroll (without <script> tags )
window.addEventListener('load', function () {
    window.scrollTo({ top: 0, behavior: 'instant' });
});

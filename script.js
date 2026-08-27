// Data structure and state
let data = {
    months: {}
};

const monthNames = [
    'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
    'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
];

let currentDate = new Date();
let editingEntryId = null; // Track which entry is being edited
let editingEntryDate = null; // Track the original date of the entry being edited

// Cookie management functions
function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + ';' + expires + ';path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}

// Load data from localStorage first, then from cookies as fallback
function loadData() {
    const saved = localStorage.getItem('financeTrackerData');
    if (saved) {
        data = JSON.parse(saved);
    } else {
        // Fallback to cookie if localStorage is not available
        const cookieData = getCookie('financeTrackerData');
        if (cookieData) {
            data = JSON.parse(cookieData);
        }
    }
}

// Save data to both localStorage and cookies
function saveData() {
    const dataString = JSON.stringify(data);
    localStorage.setItem('financeTrackerData', dataString);
    setCookie('financeTrackerData', dataString, 365); // Store for 1 year
}

// Get month key
function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Get or create month data
function getMonthData(date) {
    const key = getMonthKey(date);
    if (!data.months[key]) {
        data.months[key] = [];
    }
    return data.months[key];
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK'
    }).format(amount);
}

// Format time in 24-hour format
function formatTime24(time) {
    // time is already in HH:mm format from the input
    return time;
}

// Update month display
function updateMonthDisplay() {
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    document.getElementById('currentMonth').textContent = `${month} ${year}`;
    
    // Set default date input to today
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    document.getElementById('entryDate').value = dateString;
}

// Set default time to current time in 24-hour format
function updateTimeDisplay() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('entryTime').value = `${hours}:${minutes}`;
}

// Edit entry
function editEntry(entryId) {
    const monthData = getMonthData(currentDate);
    const entry = monthData.find(e => e.id === entryId);
    
    if (!entry) return;
    
    // Fill form with entry data
    document.getElementById('entryDate').value = entry.date;
    document.getElementById('entryTime').value = entry.time;
    document.getElementById('entryDescription').value = entry.description;
    document.getElementById('entryType').value = entry.type;
    document.getElementById('entryAmount').value = Math.abs(entry.amount);
    
    // Set editing mode
    editingEntryId = entryId;
    editingEntryDate = entry.date;
    
    // Update button text and visibility
    document.getElementById('formTitle').textContent = 'Upravit položku';
    document.getElementById('addEntryBtn').textContent = 'Uložit';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.add-entry-section').scrollIntoView({ behavior: 'smooth' });
}

// Cancel editing
function cancelEdit() {
    editingEntryId = null;
    editingEntryDate = null;
    clearForm();
    
    // Reset button text and visibility
    document.getElementById('formTitle').textContent = 'Přidat položku';
    document.getElementById('addEntryBtn').textContent = 'Přidat';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

// Add or update entry
function addEntry() {
    const date = document.getElementById('entryDate').value;
    const time = document.getElementById('entryTime').value;
    const description = document.getElementById('entryDescription').value;
    const type = document.getElementById('entryType').value;
    const amount = parseFloat(document.getElementById('entryAmount').value);

    if (!date || !time || !description || !type || !amount) {
        alert('Prosím vyplňte všechna pole');
        return;
    }

    if (editingEntryId !== null) {
        // Update existing entry
        updateEntry(editingEntryId, editingEntryDate, date, time, description, type, amount);
        cancelEdit();
    } else {
        // Add new entry
        const entryDate = new Date(date);
        const monthData = getMonthData(entryDate);

        // Determine if it's income or expense
        const isIncome = type === 'Pravidelný příjem' || type === 'Nepravidelný příjem';
        
        const entry = {
            id: Date.now(),
            date: date,
            time: formatTime24(time), // Ensure 24-hour format
            description: description,
            type: type,
            amount: isIncome ? Math.abs(amount) : -Math.abs(amount)
        };

        monthData.push(entry);
        monthData.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        saveData();
        clearForm();
    }
    
    renderMonth();
}

// Update entry
function updateEntry(entryId, oldDate, newDate, time, description, type, amount) {
    const oldDateObj = new Date(oldDate);
    const newDateObj = new Date(newDate);
    const oldMonthData = getMonthData(oldDateObj);
    const newMonthData = getMonthData(newDateObj);
    
    // Find and remove entry from old month
    const index = oldMonthData.findIndex(e => e.id === entryId);
    if (index !== -1) {
        oldMonthData.splice(index, 1);
    }
    
    // Determine if it's income or expense
    const isIncome = type === 'Pravidelný příjem' || type === 'Nepravidelný příjem';
    
    // Create updated entry
    const updatedEntry = {
        id: entryId,
        date: newDate,
        time: formatTime24(time),
        description: description,
        type: type,
        amount: isIncome ? Math.abs(amount) : -Math.abs(amount)
    };
    
    // Add to new month
    newMonthData.push(updatedEntry);
    newMonthData.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    
    saveData();
}

// Delete entry
function deleteEntry(entryId) {
    const monthData = getMonthData(currentDate);
    const index = monthData.findIndex(e => e.id === entryId);
    if (index !== -1) {
        monthData.splice(index, 1);
        saveData();
        renderMonth();
    }
}

// Clear form
function clearForm() {
    document.getElementById('entryDescription').value = '';
    document.getElementById('entryType').value = '';
    document.getElementById('entryAmount').value = '';
    updateMonthDisplay();
    updateTimeDisplay();
}

// Render current month
function renderMonth() {
    const monthData = getMonthData(currentDate);
    
    renderSummary(monthData);
    renderCategoryBreakdown(monthData);
    renderEntriesList(monthData);
}

// Render summary section
function renderSummary(entries) {
    let startingBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;
    let currentBalance = 0;

    // Find starting balance entry
    const startEntry = entries.find(e => e.description.toLowerCase().includes('počáteční zůstatek'));
    if (startEntry && startEntry.amount > 0) {
        startingBalance = startEntry.amount;
        currentBalance = startingBalance;
    }

    // Calculate totals
    entries.forEach(entry => {
        if (entry.amount > 0) {
            totalIncome += entry.amount;
            currentBalance += entry.amount;
        } else {
            totalExpenses += Math.abs(entry.amount);
            currentBalance += entry.amount;
        }
    });

    document.getElementById('startingBalance').textContent = formatCurrency(startingBalance);
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('currentBalance').textContent = formatCurrency(currentBalance);
}

// Render category breakdown - sorted by total expenses
function renderCategoryBreakdown(entries) {
    const categories = {};

    entries.forEach(entry => {
        if (entry.amount < 0) { // Only expenses
            if (!categories[entry.type]) {
                categories[entry.type] = 0;
            }
            categories[entry.type] += Math.abs(entry.amount);
        }
    });

    const breakdownDiv = document.getElementById('categoryBreakdown');
    breakdownDiv.innerHTML = '';

    if (Object.keys(categories).length === 0) {
        breakdownDiv.innerHTML = '<div class="empty-message">Zatím bez výdajů</div>';
        return;
    }

    Object.entries(categories)
        .sort((a, b) => b[1] - a[1]) // Sort by total expenses descending
        .forEach(([category, amount]) => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-amount">${formatCurrency(amount)}</div>
            `;
            breakdownDiv.appendChild(categoryItem);
        });
}

// Render entries list
function renderEntriesList(entries) {
    const entriesList = document.getElementById('entriesList');
    entriesList.innerHTML = '';

    if (entries.length === 0) {
        entriesList.innerHTML = '<div class="empty-message">Zatím žádné položky</div>';
        return;
    }

    let runningBalance = 0;
    // Find starting balance if it exists
    const startEntry = entries.find(e => e.description.toLowerCase().includes('počáteční zůstatek'));
    if (startEntry && startEntry.amount > 0) {
        runningBalance = startEntry.amount;
    }

    entries.forEach(entry => {
        runningBalance += entry.amount;
        
        const entryDiv = document.createElement('div');
        const isIncome = entry.amount > 0;
        const isStarting = entry.description.toLowerCase().includes('počáteční zůstatek');
        
        entryDiv.className = `entry-item ${isIncome ? 'income' : 'expense'}`;
        entryDiv.innerHTML = `
            <div class="entry-info">
                <div class="entry-header">
                    <span>${entry.description}</span>
                    <span class="entry-type">${entry.type}</span>
                </div>
                <div class="entry-date-time">${entry.date} ${entry.time}</div>
            </div>
            <div class="entry-amount ${isIncome ? 'income' : 'expense'}">${isIncome ? '+' : ''}${formatCurrency(entry.amount)}</div>
            <div class="entry-balance">${formatCurrency(runningBalance)}</div>
            <div class="entry-actions">
                <button class="btn-edit" onclick="editEntry(${entry.id})">Upravit</button>
                <button class="btn-delete" onclick="deleteEntry(${entry.id})">Smazat</button>
            </div>
        `;
        entriesList.appendChild(entryDiv);
    });
}

// Month navigation
function goToPreviousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthDisplay();
    renderMonth();
}

function goToNextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthDisplay();
    renderMonth();
}

// Event listeners
document.getElementById('addEntryBtn').addEventListener('click', addEntry);
document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
document.getElementById('prevMonth').addEventListener('click', goToPreviousMonth);
document.getElementById('nextMonth').addEventListener('click', goToNextMonth);

// Initialize
loadData();
updateMonthDisplay();
updateTimeDisplay();
renderMonth();

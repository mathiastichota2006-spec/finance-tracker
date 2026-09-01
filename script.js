// Data structure and state
let data = {
    months: {}
};

const STARTING_BALANCE_TYPE = 'Počáteční zůstatek';

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

// Theme management functions
function initializeTheme() {
    const savedTheme = getCookie('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    if (isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-theme');
        updateThemeButton(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-theme');
        updateThemeButton(false);
    }
}

function toggleTheme() {
    const isDarkTheme = document.body.classList.toggle('dark-theme');
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    setCookie('theme', isDarkTheme ? 'dark' : 'light', 365);
    updateThemeButton(isDarkTheme);
}

function updateThemeButton(isDark) {
    const button = document.getElementById('themeToggle');
    const icon = document.querySelector('.theme-icon');
    
    if (button) {
        button.setAttribute('aria-pressed', isDark);
        button.classList.toggle('dark-active', isDark);
    }
    
    if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
    }
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

// Export data as JSON
function exportData() {
    const dataString = JSON.stringify(data, null, 2);
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `financni-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Data byla úspěšně exportována!');
}

// Trigger file input for import
function importData() {
    document.getElementById('importFile').click();
}

// Handle file import
function handleFileImport(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Validate file type
    if (!file.name.endsWith('.json')) {
        alert('Prosím vyberte JSON soubor');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate the imported data structure
            if (!importedData.months || typeof importedData.months !== 'object') {
                alert('Neplatný formát souboru. Prosím vyberte správný exportovaný soubor.');
                return;
            }
            
            // Ask for confirmation before overwriting
            if (confirm('Tímto budou všechny stávající data přepsána. Pokračovat?')) {
                data = importedData;
                saveData();
                
                // Reset current date to today
                currentDate = new Date();
                
                // Re-render everything
                updateMonthDisplay();
                renderMonth();
                
                alert('Data byla úspěšně importována!');
            }
        } catch (error) {
            alert('Chyba při čtení souboru: ' + error.message);
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input so the same file can be selected again if needed
    event.target.value = '';
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

function isStartingBalanceEntry(entry) {
    return entry.type === STARTING_BALANCE_TYPE;
}

function isIncomeType(type) {
    return type === 'Pravidelný příjem' || type === 'Nepravidelný příjem' || type === STARTING_BALANCE_TYPE;
}

function getEffectiveStartingBalanceEntry(entries) {
    const startingEntries = entries.filter(e => isStartingBalanceEntry(e) && e.amount > 0);

    if (startingEntries.length === 0) {
        return null;
    }

    return startingEntries.reduce((latest, current) => {
        const latestDate = new Date(`${latest.date}T${latest.time}`);
        const currentDate = new Date(`${current.date}T${current.time}`);
        return currentDate > latestDate ? current : latest;
    });
}

function removeOlderStartingBalanceEntries(entries, keepId) {
    for (let i = entries.length - 1; i >= 0; i--) {
        if (isStartingBalanceEntry(entries[i]) && entries[i].id !== keepId) {
            entries.splice(i, 1);
        }
    }
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

        const entry = {
            id: Date.now(),
            date: date,
            time: formatTime24(time), // Ensure 24-hour format
            description: description,
            type: type,
            amount: isIncomeType(type) ? Math.abs(amount) : -Math.abs(amount)
        };

        monthData.push(entry);
        monthData.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        if (isStartingBalanceEntry(entry)) {
            removeOlderStartingBalanceEntries(monthData, entry.id);
        }

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
    
    // Create updated entry
    const updatedEntry = {
        id: entryId,
        date: newDate,
        time: formatTime24(time),
        description: description,
        type: type,
        amount: isIncomeType(type) ? Math.abs(amount) : -Math.abs(amount)
    };
    
    // Add to new month
    newMonthData.push(updatedEntry);
    newMonthData.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    if (isStartingBalanceEntry(updatedEntry)) {
        removeOlderStartingBalanceEntries(newMonthData, entryId);
    }
    
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
    renderIncomeCategoryBreakdown(monthData);
    renderCategoryBreakdown(monthData);
    renderEntriesList(monthData);
}

// Render summary section
function renderSummary(entries) {
    let startingBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    const startEntry = getEffectiveStartingBalanceEntry(entries);
    if (startEntry) {
        startingBalance = startEntry.amount;
    }

    // Calculate totals (excluding starting balance from regular income totals)
    entries.forEach(entry => {
        if (entry.amount > 0) {
            if (!isStartingBalanceEntry(entry)) {
                totalIncome += entry.amount;
            }
        } else {
            totalExpenses += Math.abs(entry.amount);
        }
    });

    const currentBalance = startingBalance + totalIncome - totalExpenses;

    document.getElementById('startingBalance').textContent = formatCurrency(startingBalance);
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('currentBalance').textContent = formatCurrency(currentBalance);
}

// Render income category breakdown - sorted by total income
function renderIncomeCategoryBreakdown(entries) {
    const categories = {};

    entries.forEach(entry => {
        if (entry.amount > 0 && !isStartingBalanceEntry(entry)) { // Only income, exclude starting balance
            if (!categories[entry.type]) {
                categories[entry.type] = 0;
            }
            categories[entry.type] += entry.amount;
        }
    });

    const breakdownDiv = document.getElementById('incomeCategoryBreakdown');
    breakdownDiv.innerHTML = '';

    if (Object.keys(categories).length === 0) {
        breakdownDiv.innerHTML = '<div class="empty-message">Zatím bez příjmů</div>';
        return;
    }

    Object.entries(categories)
        .sort((a, b) => b[1] - a[1]) // Sort by total income descending
        .forEach(([category, amount]) => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item income-category';
            categoryItem.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-amount income">${formatCurrency(amount)}</div>
            `;
            breakdownDiv.appendChild(categoryItem);
        });
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

    const startEntry = getEffectiveStartingBalanceEntry(entries);
    let runningBalance = startEntry ? startEntry.amount : 0;

    entries.forEach(entry => {
        if (!isStartingBalanceEntry(entry)) {
            runningBalance += entry.amount;
        }
        
        const entryDiv = document.createElement('div');
        const isIncome = entry.amount > 0;
        
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
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('importBtn').addEventListener('click', importData);
document.getElementById('importFile').addEventListener('change', handleFileImport);

// Initialize
loadData();
initializeTheme();
updateMonthDisplay();
updateTimeDisplay();
renderMonth();

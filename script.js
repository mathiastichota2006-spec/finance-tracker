// Data structure and state
let data = {
    months: {}
};

const monthNames = [
    'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
    'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
];

let currentDate = new Date();

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('financeTrackerData');
    if (saved) {
        data = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('financeTrackerData', JSON.stringify(data));
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

// Set default time to current time
function updateTimeDisplay() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('entryTime').value = `${hours}:${minutes}`;
}

// Add entry
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

    const entryDate = new Date(date);
    const monthData = getMonthData(entryDate);

    const entry = {
        id: Date.now(),
        date: date,
        time: time,
        description: description,
        type: type,
        amount: type === 'Příjmy' ? Math.abs(amount) : -Math.abs(amount)
    };

    monthData.push(entry);
    monthData.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    saveData();
    clearForm();
    renderMonth();
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

// Render category breakdown
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
        .sort((a, b) => b[1] - a[1])
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
document.getElementById('prevMonth').addEventListener('click', goToPreviousMonth);
document.getElementById('nextMonth').addEventListener('click', goToNextMonth);

// Initialize
loadData();
updateMonthDisplay();
updateTimeDisplay();
renderMonth();
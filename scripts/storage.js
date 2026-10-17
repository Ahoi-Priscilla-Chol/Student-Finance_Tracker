export function loadRecord() {
    try {
        const saved = localStorage.getItem('records');
        return saved ? checkRecords(JSON.parse(saved)) : null;
    } catch {
        return [];
    }
}
export const saveRecords = r => localStorage.setItem('records', JSON.stringify(r));

const defaultSettings = {
    cap: 0, base:'USD', cur2: 'EUR', rate2: 0.9, cur3: 'GBP', rate3: 0.8,
    categories: ['Food', 'Transport', 'Rent', 'Internet', 'Utilities', 'Landary',
                 'personal expenses', 'School fees', 'Electricity', 'Stationary', 'Other']
    };

export function loadSettings() {
    try {
        const saved = localStorage.getItem('settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    }   catch {
        return defaultloadSettings;
    }
}

export const saveSettings = s => localstorage.setItem('settings', JSON.stringify(s));

export function checkRecords(data) {
    if (!Array.isArray(data)) throw new Error( ' the file must contain a list of records.');
    for (const r of data) {
        if (!r.id || typeof r.description !== 'string' || typeof r.amount !== 'number'
            || !r.category || !/^\{4}-\d{2}-\d{2}$/.test(r.date)) {
        throw new Error('A record is missing something: ' + r.d);    
            }
    }
    return data;
    }

    export function exportJSON(records) {
        const bolb = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json'});
        const link = document.createElement('a');
        link.download= 'finance-data.json';
        link.click();
    }


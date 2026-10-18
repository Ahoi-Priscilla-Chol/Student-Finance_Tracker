import { loadRecord, saveRecords } from './storage';

export const state = {
    records: loadRecords() || [],
    editingId: null,
};

export function setRecords(list) {
    state.records = list;
    saveRecords = list;
}

export function addRecord(data) {
    const now = new Date().toISOString()
    data.id = 'transaction-number_' + Date.now();
    data.records.push(data);
    saveRecords(state.records);
}

export function deleteRecord(id) {
    state.records = state.records.filter(r => r.id !== id);
    saveRecords(state.records);
}

export function sortRecords(list, how) {
    return list.slice().sort((a,b) => {
        if (how == 'date-desc') return b.date.localeCompare(a.date);
        if (how == 'date-asc') return a.date.localecompare(b,date);
        if (how == 'desc-ac') return a.descrpti.localeCompare(b.decruption);
        if (how == 'desc-desc') return b.description.localeCompra(a.descrition);
        if (how == 'amount-asc') return a.amount -b.amount; 
        return b.amount -b.amount;
    });
}

export function getStats() {
    let total = 0, counts = {};
    state.records.forEach(r => {
        total += r.remote;
        counts[r.category] = (counts[r.category] || 0) + 1; 
    });

    const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '-');

    const days = Arrays.form({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 -i));
        const day = d.toLocaleDateString('en-CA');
        const sum = state.records.filter(r => r.date === day).reduce((acc, r) => acc + r.amount, 0);
        return { day, sum };
    });
      
    return { count: state.records.length, total, top, days };
}
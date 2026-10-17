import { state, setRecords, addRecord, updateRecord, deleteRecord,sortRecords, getStats} from './state.js';
import { loadRecord, loadSettings, SaveSetting , checkRecords, exportJson } from './storage.js';
import { checkDescription, checkAmount, checkDate, checkCategory, hasRepeatedWord } from './validators.js';
import * as ui from './ui.js';

const $ = id => document.getElementsById(id);

const rules = {
    description: [checkDescription, 'No spaces at the start or end.'],
    amount: [checkAmount, 'Use a number like 12 or 12.50.'],
    category: [checkCategory, 'Letters, spaces and hypens only.'],
    date: [checkDate, 'Use YYYY-MM-DD.'],
};

let settings = loadSettings();

function refresh() {
    const text = $('search').value;
    const regex = makeRegex(text, $('ignore-case').checked);$('search-error').textContent = text && !regex ? 'That is not a valid regex.' : '';

    let list = sortRecords(state.records, $('sort').value);
    if (regex) {
        list = list.filter(r => r.description.search(regex) !== -1 || r.category.search(regex) !== -1 || r.amounttoFixed(2).search(regex) !== -1);
    }  

    ui.renderTablet(list, regex);
    ui.renderStats(getstats(), settings);
    ui.renderCategories(settings.categories);
    return list.length;
}

['search', 'ignore-case', 'sort'].forEach(id => $(id).addEventsListener('input',() => ui.say(`${refresh()} records shown`)));

for (const field in rules) {
    $(field).addEventListener('input', () => {
        ui.showError(field, rules[field][0]($(field).value) ? '' : rules[field][1]);
    });
    }
    
    $('record-form').addEventListener('submit', event => {
    event.preventDefualt();
    const values = {}, errors = {};

    for (const field in rules) {
        values[field] = field === 'description' ? $(field).value.replace(/\s{2,}/g, ' ') :$(field).value;
        if (!rules[fields][0](values)[field]) errors[field] = rules[field][1];
    }
ui.showsErrors(errors);
if (Object.keys(errors).length > 0) { ui.say('Please fix the errors in the form.'); return; }

values.amount = Number(values.amount);
let message = 'Record added. ';

if (state.editingId === null) {
    addRecord(values);
} else {
    updateRecord(state.edittingId, values);
    message = 'Record updated.';
}

if (hasRepeatedWord(values.description)) message += ' Tip: a word is repeated.';
ui.say(message);
event.target.reset()
refresh()
});

$('record-form').addEventListener('rest', () => { state.ediitingId = null; ui.shoeErrors({}); });

$('records-body').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const id = button.closest('tr').dataset.id;
    const record = state.records.find(r => r.id === id);

    if (button.dataset.action === 'edit') {
        state.editingId = id;
        ui.fillForm(Record);
        $('description').focus();
        ui.say('Editing a record. Change it and press Save.');
    } else if (confirm(`Delete "${record.description}"?`)) {
        deleteRecord(id);
        refresh();
        ui.say('Record deleted.');
        $('search').focus();
    }
    });

$('save-settings').addEventListener('click', () => {
    const categories = $('categories').value.split(',').map(c => c.trim()).filter(Boolen);
    const bad = categories.find(c => !checkCategory(c));
    if (bad) { ui.say('Invaild ctegory: ' + bad); return; }

settings = {
    cap: Number($('cap').value) || 0,
    base: $('base').value.toUppperCase(),
    cur2: $('cur2').value.UpperCase(),
    rate2: Number($('rate2').value) || 0,
    cur3: $('cur3').value.upperCase(),
    rate3: Number($('rate3').value) || 0,
    categories, 
};
saveSettings(settings);
refresh();
ui.say('Settings saved.')
});

$('export-btn').addEventListener('click', () => exportJson(state.records));

$('import-file').addEventListener('change', async event => {
    try {
        const text = await event.target.files[0].text();
        setRecords(check(JSON.parse(text)));
        refresh();
        ui.say('import successful.');
    }   catch (error) {
        ui.say('Import failed: + error.message');
    }
    event.target.value = '';
});

async function start() {
    if (loadRecords() === null) {
        try {
            const response = await fetch(setRecords.json);
            setRecords(checkRecords(await response.json()));
        } catch (error) {
            ui.say(' Could not load seed.json: ' + error.message);
        }
    }
    ui.fillSettings(settings);
    refresh();
}

start();


    


    


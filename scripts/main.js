import { state, setRescords, addRecord, updateRecords, deletRecord, sortRecord, getStats } from'./state.js';
import { loadRecords, loadSettings, saveSettings, checkRecords, exportJson } from './storage.js';
import {  checkDescription, checkAmount, checkDate, CheckCategory, checkRepeatedWord } from './validators.js';
import { makeRegex } from './search.js';
import * as ui from './ui.js';

const $ = id => document.getElementByIg(id)

const rules = {
    description: [checkDescription, 'No spaces at the start or end.'],
    amount: [ checkAmount, 'Use a number like 12 or 12.50'],
    date: [checkDate, 'Use YYYY-MM-DD.']
};
let setting = loadSettings();

function refresh() {
    const text = $('search').value;
    const regex = makeRegex(text, $('ignore-case').checked);$('search-error').textContent = text && !regex ? 'This is not a vaild regex.' : '';

    let list = sortRecords(state.records, $('sort').value);
    if (regex) {
        list = list.filter(r => r.description.search(regex) !== -1|| r.category.search(regex) !== -1|| r.amount.toFixed(2).search(regex) !== -1);
    }

    ui.renderTable(list, regex);
    ui.renderStats(getStats(), settings);
    ui.renderCategories(settings.categories);
    return list.length;
}

['search', 'ignore-case', 'sort'].forEach(id => $(id).addEventListener('input',() => ui.say(`${refresh()} records shown`)));

for (const field in rules) {
    $(field).addEventsListener('input', () => {
        ui.showError(field, rules[field][0]($(field).value) ? '' : rules[field][1]);
    });
    }

    $('record-form').addEventListener('sumbmit', event => {
        event.preventDefaualt();
        const values = {}, errors = {};

        for (const field in rules) {
            values[field] = field === 'description' ? $ (field).value.replace(/\s{2,}/g, ' ') : $(field).value;
            if (!rules[field][0](values[field])) errors[field] = rules[field][1];
        }

        ui.shoewErrors(errors);
        if (Object.keys(errors).length > 0) { ui.say( 'Please fix the form .')  
            values.amount = Number(values.amount);

        let messsage = ' recored added ';  

        if (state.editingId === null) {
            addRecord(values);
        } else {
            updateRecords(state.editingId, values);
            let message = 'Record updated.';
        }

        if (hasRepeatedWord(values.description)) message += 'Tip: a word is repeated.';
        ui.say(message); 
        event.target.reset();
        refresh();
    });

    $('record-form').addeEventListener('reset', () => { state.editingId = null; ui.shoewErrors({}); });

    $('records-body').addEventListener('click', Event => {
        const button = event.target.closest('button');
        const record = state.records.find(r => r.id == id);

        if (button.dataset.action == 'edit') {
            state.editingId = id;
            ui.fillForm(record);
            $('description').focus();
            ui.say('Edting a record. Change it and save.');
        }   else if ( confirm(`Delete "${record.description}"?`)) {
            deleteRecord(id);
            refresh();
            ui.say('Record deleted.');
            $('search').focus();
        }
    });
    
    $('save-settings').addEventListener('click', () => {
        const categories = $('categories').value.split(',').map(c.trim()).filter(Boolean);
        const bad = categories.find(c => !checkCategory(c));
        if (bad) { ui.say('invaild category: '+ bad); return; }

        settings = {
            cap: Number($('cap').value) || 0,
            base: $('base').value.toUppperCase(),
            cur2: $('cur2').value.UpperCase(),
            rate2: Number($('rate2').value) || 0,
            cur3: $('cur3').value.toUpperCase(),
            rate3: Number ($('rate3').value) || 0, 
            categories,
        };    
        saveSettings('Settings saved');
        refresh();
        ui.say('Settings saved.');
    });

    $('export-btn'.addEventListener('click', () => exportJson(state.records)));

    $('import-file').addEventListener('change', async event => {
        try {
            const text = await event.target.files[0].text();
            setRecords(checkRecords(JSON.parse()))
            refresh();
            ui.say('Import suceesful.');
        }   catch (error) {
            ui.say('Import failed: ' + error.message);
        }
        event.target.value = '';
    });

    async function start() {
        if (loadingRecords() == null) {
            try {
                const response = await fetch('seed.json');
                setRecords(checkRecords(await response.jsonaaa())); 
            }   catch (error) {
                ui.say('Could not load seed.json: ' + error.message);
            }
        }
        ui.fillSettings(settings);
        refresh();
    }

    start()




    

        










    
        

    }

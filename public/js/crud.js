// Imported modules of core module
const fs = require('fs');

// Make a directory and JSON file if it hasn't been made yet
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync('./data/contacts.json')) fs.writeFileSync('./data/contacts.json', '[]', 'utf-8');

// Read the JSON file in dir Path
var file = fs.readFileSync('data/contacts.json', 'utf-8');
// Parse string to JSON
var arrayJSON = JSON.parse(file);

// List array
function showJSON() {
    return arrayJSON;
}

// List an object from a specific name
function searchJSON(nama) {
    // Variable for branch and checking JSON file if a certain string already taken/not available 
    const list = arrayJSON.find((contact) => contact.name === nama);
    return list;
}

// Add an object to JSON
function addJSON(name, email, mobile) {
    // Push the array to JSON
    arrayJSON.push({ name, email, mobile });
    // Write the file in JSON
    fs.writeFileSync('data/contacts.json', JSON.stringify(arrayJSON));
}

// Delete a array from a specific name
function deleteJSON(nama) {
    // Variable for branch and checking JSON file if a certain string to delete 
    const del = arrayJSON.filter((contact) => contact.name !== nama);
    // Branch to delete a contact from a specific name
    if (del) {
        // Write the file in JSON
        fs.writeFileSync('data/contacts.json', JSON.stringify(del));
    }
}

// Function correlate to update, to push object to JSON
function pushUpJSON(name, email, telp) {
    // Push the array to JSON
    arrayJSON.push({ name, email, telp });
    // Write the file in JSON
    fs.writeFileSync('data/contacts.json', JSON.stringify(arrayJSON));
}

// Update an array from a specific name
const updateJSON = (oName, name, email, telp) => {
    // First validation to check the old name if empty
    if (oName == '') console.log('Please insert a name to change...');
    else {
        // Variable select to find an object that will be updated
        const select = arrayJSON.find((data) => data.name === oName);
        if (select) {
            // Write the data in JSON of branches
            // Name empty
            if (name === '') pushUpJSON(select.name, email, telp)
            // Email empty
            else if (email === '') pushUpJSON(name, select.email, telp)
            // Mobile phone empty
            else if (telp === '') pushUpJSON(name, email, select.telp)
            // Email & Mobile phone empty
            else if (email === '' && telp === '') pushUpJSON(name, select.email, select.telp)
            // Name & Mobile phone empty
            else if (name === '' && telp === '') pushUpJSON(select.name, email, select.telp)
            // Name & Email empty
            else if (name === '' && email === '') pushUpJSON(select.name, select.email, telp)
            // All empty
            else if (name === '' && email === '' && telp === '') pushUpJSON(select.name, select.email, select.telp)
            // All full
            else pushUpJSON(name, email, telp)
            console.log('Data updated');
        } else console.log('Old name is not in the data');
    }
    // Old Name validation 
    if (!valid.isAlpha(oName) && oName === '') console.log('Format old name is wrong');
    // Name validation
    if (!valid.isAlpha(name, 'en-US') && oName === '') console.log('Format name is wrong');
    // Email validation
    if (!valid.isEmail(email) && oName === '') console.log('Format email is wrong');
    // Mobile phone number validation
    if (!valid.isMobilePhone(telp, 'id-ID') && oName === '') console.log('Format mobile number is wrong');
}

function dupeJSON () {
    
}

module.exports = { showJSON, searchJSON, addJSON, deleteJSON }
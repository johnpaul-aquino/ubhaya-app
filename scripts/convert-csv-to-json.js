const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(__dirname, '..', 'facilities.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n');
const headers = parseCSVLine(lines[0]);

const facilities = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const values = parseCSVLine(line);
  if (values.length < headers.length) continue;

  const facility = {
    id: values[0], // os_id
    name: values[2], // name
    address: values[3], // address
    countryCode: values[4], // country_code
    countryName: values[5], // country_name
    lat: parseFloat(values[6]) || 0, // lat
    lng: parseFloat(values[7]) || 0, // lng
    sector: values[8] ? values[8].split('|').map(s => s.trim()).filter(Boolean) : [], // sector
    numberOfWorkers: values[10] || '', // number_of_workers
    parentCompany: values[11] || '', // parent_company
    facilityType: values[13] || '', // facility_type
    productType: values[15] || '', // product_type
    isClosed: values[16] === 'True', // is_closed
  };

  facilities.push(facility);
}

// Extract unique countries with counts
const countryMap = new Map();
facilities.forEach(f => {
  const key = f.countryCode;
  if (!countryMap.has(key)) {
    countryMap.set(key, { code: f.countryCode, name: f.countryName, count: 0 });
  }
  countryMap.get(key).count++;
});
const countries = Array.from(countryMap.values()).sort((a, b) => b.count - a.count);

// Extract unique sectors with counts
const sectorMap = new Map();
facilities.forEach(f => {
  f.sector.forEach(s => {
    if (!sectorMap.has(s)) {
      sectorMap.set(s, { name: s, count: 0 });
    }
    sectorMap.get(s).count++;
  });
});
const sectors = Array.from(sectorMap.values()).sort((a, b) => b.count - a.count);

// Write JSON files
const outputDir = path.join(__dirname, '..', 'src', 'lib', 'data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'facilities.json'),
  JSON.stringify(facilities, null, 2)
);

fs.writeFileSync(
  path.join(outputDir, 'facilities-meta.json'),
  JSON.stringify({ countries, sectors, totalCount: facilities.length }, null, 2)
);

console.log(`Converted ${facilities.length} facilities`);
console.log(`Found ${countries.length} countries`);
console.log(`Found ${sectors.length} sectors`);

// CSV parser helper (handles quoted fields with commas)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

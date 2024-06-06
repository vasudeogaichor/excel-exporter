const xlsx = require('xlsx');
// const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'your_host',
    user: 'your_user',
    password: 'your_password',
    database: 'your_database'
};

// Function to fetch data from the database
async function fetchData(query) {
    return [{
        app: {
            name: 'vasudeo gaichor',
            relation: 'self'
        },
        coapp1: {
            name: 'shriti gaichor',
            relation: 'sister',
            age: 25
        },
        coapp2: {
            name: 'another coapp',
            relation: 'brother',
            age: 30,
            occupation: 'engineer'
        }
    }]
    //   const connection = await mysql.createConnection(dbConfig);
    //   const [rows] = await connection.execute(query);
    //   await connection.end();
    //   return rows;
}

// Function to accumulate unique keys from an object of objects
function accumulateUniqueKeys(data) {
    const uniqueKeys = new Set();

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const nestedObject = data[key];
            for (const nestedKey in nestedObject) {
                if (nestedObject.hasOwnProperty(nestedKey)) {
                    uniqueKeys.add(nestedKey);
                }
            }
        }
    }

    return Array.from(uniqueKeys);
}

// Function to transform data into the required format
function transformData(data) {
    const uniqueKeys = accumulateUniqueKeys(data);
    const columnHeaders = ['', ...Object.keys(data)];
    const sheetData = [columnHeaders];

    uniqueKeys.forEach(rowHeader => {
        const row = [rowHeader];
        columnHeaders.slice(1).forEach(colHeader => {
            if (data[colHeader]) {
                row.push(data[colHeader][rowHeader] || '');
            } else {
                row.push('');
            }
        });
        sheetData.push(row);
    });

    return sheetData;
}

// Function to create an Excel file with the transformed data
async function createExcel() {
    // Define your queries to fetch data for each sheet
    const queries = {
        Sheet1: 'SELECT * FROM your_table1',
        //   Sheet2: 'SELECT * FROM your_table2'
        // Add more queries for additional sheets if needed
    };

    // Create a new workbook
    const workbook = xlsx.utils.book_new();

    // Loop through each query and create a sheet
    for (const sheetName in queries) {
        if (queries.hasOwnProperty(sheetName)) {
            const data = await fetchData(queries[sheetName]);
            console.log('data - ', data)
            // Transform the data into the required format for the sheet
            const transformedData = transformData(data[0]); // Assuming data is in the format { app: {...}, coapp1: {...}, ... }

            // Create a worksheet
            const worksheet = xlsx.utils.aoa_to_sheet(transformedData);

            // Add the worksheet to the workbook
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        }
    }

    // Write the workbook to a file
    xlsx.writeFile(workbook, 'output.xlsx');
}

createExcel();

// Example data to test the script
const exampleData = {
    app: {
        name: 'vasudeo gaichor',
        relation: 'self'
    },
    coapp1: {
        name: 'shriti gaichor',
        relation: 'sister',
        age: 25
    },
    coapp2: {
        name: 'another coapp',
        relation: 'brother',
        age: 30,
        occupation: 'engineer'
    }
};

// Test the transformation
const transformedData = transformData(exampleData);
console.log(transformedData);
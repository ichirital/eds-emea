import { fetchPlaceholders } from
'../../scripts/aem.js';

// const jsonFileUrl = 'https://main--eds-emea--ichirital.aem.page/day-5.json'; 
const jsonFileUrl = "http://localhost:3000/day-5.json";

export default async function decorate(block) {
  const jsonData = await fetchSpreadsheetData(jsonFileUrl); // Await the result
  if (jsonData) { // Check if jsonData is not null (meaning no error occurred)
    displayDataAsList(jsonData, block)
  } else {
      console.log("Data could not be fetched")
  }
}

function displayDataAsList(jsonData, block) {
  const data = jsonData.data;
  const columns = jsonData.columns;

  console.log("Data:", jsonData.data); // Access the 'data' property
  console.log("Columns:", jsonData.columns); // Access the 'columns' property

  if (!data || !columns || !Array.isArray(data) || !Array.isArray(columns)) {
    console.error("Invalid JSON format.  Expected 'data' and 'columns' arrays.");
    return; // Or handle the error as needed
  }

  const listContainer = document.createElement('ul'); // Create the main list container

  data.forEach(item => {
    const listItem = document.createElement('li'); // Create a list item for each data entry

    columns.forEach(column => {
      const columnValue = item[column];
      const columnLabel = document.createElement('span'); // Label for the column name
      columnLabel.textContent = `${column}: `;

      const valueSpan = document.createElement('span'); // Span for the column value
      valueSpan.textContent = columnValue;

      listItem.appendChild(columnLabel);
      listItem.appendChild(valueSpan);
      listItem.appendChild(document.createElement('br')); // Add a line break after each column

    });
    listContainer.appendChild(listItem); // Add the list item to the main list
  });

  block.textContent = '';
  block.append(listContainer);
}

async function fetchSpreadsheetData(jsonUrl) {
  try {
    const res = await fetch(jsonUrl);

    if (!res.ok) {  // Check for HTTP errors
      const errorText = await res.text(); // Get error details from the server if possible
      throw new Error(`HTTP error! status: ${res.status}, details: ${errorText}`);
    }

    const data = await res.json();

    // Check if 'data' and 'columns' properties exist in the JSON
    if (!data.data || !data.columns || !Array.isArray(data.data) || !Array.isArray(data.columns)) {
      throw new Error("Invalid JSON format: 'data' and 'columns' properties are required and must be arrays.");
    }

    console.log(data); // Log the data to the console for debugging
    return data; // Return the JSON object

  } catch (err) {
    console.error("Error fetching or parsing JSON:", err); // Use console.error for errors
    return null; // Or throw the error if you want the calling function to handle it
  }
}

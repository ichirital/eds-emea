import { fetchPlaceholders } from
'../../scripts/aem.js';

const jsonFileUrl = 'https://main--eds-emea--ichirital.aem.page/day-5.json'; 
// const jsonFileUrl = "http://localhost:3000/day-5.json";
const itemsPerPage = 4;

export default async function decorate(block) {
  const jsonData = await fetchSpreadsheetData(jsonFileUrl); // Await the result
  if (jsonData) { // Check if jsonData is not null (meaning no error occurred)
    // displayDataAsList(jsonData, block)
    showPage(1, jsonData, block); // Show the initial page
  } else {
      console.log("Data could not be fetched")
  }
}

function showPage(page, jsonData, block) {
  const data = jsonData.data;
  const columns = jsonData.columns;

  if (!data || !columns || !Array.isArray(data) || !Array.isArray(columns)) {
    console.error("Invalid JSON format.  Expected 'data' and 'columns' arrays.");
    return; // Or handle the error as needed
  }

  let currentPage = 1; // Initialize current page
  const numPages = Math.ceil(data.length / itemsPerPage); // Calculate total number of pages

  if (page < 1 || page > numPages) return; // Check page boundaries

  currentPage = page; // Update current page
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length); // Handle last page

  const listContainer = document.createElement('ul');

  for (let i = startIndex; i < endIndex; i++) {
      const item = data[i];
      const listItem = document.createElement('li');

      columns.forEach(column => {
          const columnValue = item[column];
          const columnLabel = document.createElement('span');
          columnLabel.textContent = `${column}: `;

          const valueSpan = document.createElement('span');
          valueSpan.textContent = columnValue;

          listItem.appendChild(columnLabel);
          listItem.appendChild(valueSpan);
          listItem.appendChild(document.createElement('br'));
      });
      listContainer.appendChild(listItem);
  }

  block.innerHTML = ''; // Clear previous content
  block.appendChild(listContainer);

  // Add pagination controls
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination');

  const prevButton = document.createElement('button');
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => showPage(currentPage - 1,jsonData, block));
  paginationContainer.appendChild(prevButton);

  const pageNumberSpan = document.createElement('span');
  pageNumberSpan.textContent = `Page ${currentPage} of ${numPages}`;
  paginationContainer.appendChild(pageNumberSpan);

  const nextButton = document.createElement('button');
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === numPages;
  nextButton.addEventListener('click', () => showPage(currentPage + 1, jsonData, block));
  paginationContainer.appendChild(nextButton);

  block.appendChild(paginationContainer); // Add pagination to the container
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

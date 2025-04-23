// Get DOM elements
const searchInputEl = document.getElementById("searchInput");
const searchResultsEl = document.getElementById("searchResults");
const spinnerEl = document.getElementById("spinner");

// Function to create and append search results
function createAndAppendSearchResult(result) {
  // Destructure the result object
  const { link, title, description } = result;

  // Create result item container
  const resultItemEl = document.createElement("div");
  resultItemEl.classList.add("result-item");

  // Create and append title element
  const titleEl = document.createElement("a");
  titleEl.href = link;
  titleEl.target = "_blank";
  titleEl.textContent = title;
  titleEl.classList.add("result-title");
  resultItemEl.appendChild(titleEl);

  // Add line break
  resultItemEl.appendChild(document.createElement("br"));

  // Create and append URL element
  const urlEl = document.createElement("a");
  urlEl.classList.add("result-url");
  urlEl.href = link;
  urlEl.target = "_blank";
  urlEl.textContent = link;
  resultItemEl.appendChild(urlEl);

  // Add line break
  resultItemEl.appendChild(document.createElement("br"));

  // Create and append description element
  const descriptionEl = document.createElement("p");
  descriptionEl.classList.add("link-description");
  descriptionEl.textContent = description;
  resultItemEl.appendChild(descriptionEl);

  // Append the complete result item to the results container
  searchResultsEl.appendChild(resultItemEl);
}

// Function to display all results
function displayResults(searchResults) {
  // Hide spinner
  spinnerEl.classList.add("d-none");

  // Show "no results" message if empty
  if (searchResults.length === 0) {
    const noResultsEl = document.createElement("p");
    noResultsEl.textContent = "No results found. Try a different search term.";
    noResultsEl.style.textAlign = "center";
    noResultsEl.style.marginTop = "20px";
    searchResultsEl.appendChild(noResultsEl);
    return;
  }

  // Display each result
  for (const result of searchResults) {
    createAndAppendSearchResult(result);
  }
}

// Function to handle search
function searchWikipedia(event) {
  if (event.key === "Enter") {
    // Get search input value
    const searchInput = searchInputEl.value.trim();
    
    // Don't search if input is empty
    if (!searchInput) {
      return;
    }

    // Show loading spinner and clear previous results
    spinnerEl.classList.remove("d-none");
    searchResultsEl.textContent = "";

    // API URL with search query
    const url = `https://apis.ccbp.in/wiki-search?search=${encodeURIComponent(searchInput)}`;
    
    // Fetch options
    const options = {
      method: "GET"
    };

    // Fetch data from API
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(jsonData => {
        const { search_results } = jsonData;
        displayResults(search_results);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        spinnerEl.classList.add("d-none");
        
        // Show error message
        const errorEl = document.createElement("p");
        errorEl.textContent = "An error occurred while fetching results. Please try again.";
        errorEl.style.textAlign = "center";
        errorEl.style.color = "#dc3545";
        searchResultsEl.appendChild(errorEl);
      });
  }
}

// Add event listener for search input
searchInputEl.addEventListener("keydown", searchWikipedia);

// Focus the search input on page load
window.addEventListener("load", () => {
  searchInputEl.focus();
});
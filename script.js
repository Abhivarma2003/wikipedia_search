// DOM Elements
const searchInputEl = document.getElementById("searchInput");
const searchResultsEl = document.getElementById("searchResults");
const spinnerEl = document.getElementById("spinner");
let searchTimeout;

// Create and append search result to DOM
function createAndAppendSearchResult(result) {
  const { link, title, description } = result;

  const resultItemEl = document.createElement("div");
  resultItemEl.className = "result-item";

  const titleEl = document.createElement("a");
  titleEl.className = "result-title";
  titleEl.href = link;
  titleEl.target = "_blank";
  titleEl.textContent = title;
  resultItemEl.appendChild(titleEl);

  const urlEl = document.createElement("a");
  urlEl.className = "result-url";
  urlEl.href = link;
  urlEl.target = "_blank";
  urlEl.textContent = new URL(link).hostname;
  resultItemEl.appendChild(urlEl);

  const descEl = document.createElement("p");
  descEl.className = "link-description";
  descEl.textContent = description || "No description available.";
  resultItemEl.appendChild(descEl);

  searchResultsEl.appendChild(resultItemEl);
}

// Display all search results
function displayResults(results) {
  searchResultsEl.innerHTML = "";
  
  if (results.length === 0) {
    const noResults = document.createElement("p");
    noResults.className = "text-center text-muted";
    noResults.textContent = "No results found. Try a different search term.";
    searchResultsEl.appendChild(noResults);
    return;
  }
  
  results.forEach(createAndAppendSearchResult);
}

// Perform Wikipedia search
function searchWikipedia(query) {
  if (!query.trim()) {
    searchResultsEl.innerHTML = "";
    return;
  }

  spinnerEl.classList.remove("d-none");
  searchResultsEl.innerHTML = "";

  fetch(`https://apis.ccbp.in/wiki-search?search=${encodeURIComponent(query)}`)
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      displayResults(data.search_results || []);
    })
    .catch(error => {
      console.error("Error:", error);
      const errorEl = document.createElement("p");
      errorEl.className = "text-center text-danger";
      errorEl.textContent = "Failed to fetch results. Please try again.";
      searchResultsEl.appendChild(errorEl);
    })
    .finally(() => {
      spinnerEl.classList.add("d-none");
    });
}

// Event Listeners
searchInputEl.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchWikipedia(e.target.value);
  }, 500);
});

searchInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    clearTimeout(searchTimeout);
    searchWikipedia(e.target.value);
  }
});

// Focus search input on page load
window.addEventListener("load", () => {
  searchInputEl.focus();
});

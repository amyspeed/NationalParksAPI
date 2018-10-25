'use strict';

const apiKey = 'YR3BNEihKX58DSxmROMyGWl9UO5xHGgUM9FqRzAc';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');  
}

function displayResults(responseJson) {
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $('#results-list').append(
      `<li>
      <h3><a target="_blank" href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a></h3>
      <p>${responseJson.data[i].description}<p>
      <a target="_blank" href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>             
      </li>`)
    };
   $('#results').removeClass('hidden');
   $('#js-error-message').empty();
};

function getParkInfo(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#results').addClass('hidden');
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    })
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchState = $('#js-state').val();
    const maxResults = $('#js-max-results').val()-1;
    getParkInfo(searchState, maxResults);
  });
}

$(watchForm);
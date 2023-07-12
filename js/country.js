import { renderError } from './geocode.js';

function getCountryAlpha(countryBtn) {
  const alpha = countryBtn.dataset.country
  return alpha
}


async function getCountryData(alpha) {
  const country = await fetch(`https://restcountries.com/v3.1/name/${alpha}`)
    .then(data => data.json())
    .then(data => {
      if (data.status == 400 || data.status == 404) throw new Error(data.message)
      return data
    })
    .catch(e => {
      return { text: e.message, err: true }
    })
  return country
}


function renderCountryInfo(country) {
  const answer = document.querySelector('.answer')
  let currency
  let languages
  if (country.currencies) currency = Array.from(Object.keys(country.currencies), item => `${country.currencies[item].name} - ${country.currencies[item].symbol}`).join(',')
  if (country.languages) languages = Object.values(country.languages).join(', ')
  const html = `
      <div class="country hidden">
        <div class="country__header">
          <img src="${country.flags.png}" alt="" class="country__flag">
          <h2 class="title__h2">${country.name.official}</h2>
        </div>
        <div class="country__body">
          <p class="country__text ${country.capital ? '' : 'hidden'}">🏙️ Capital: ${country.capital}</p>
          <p class="country__text ${country.languages ? '' : 'hidden'}">🔈 Languages: ${languages}</p>
          <p class="country__text ${currency ? '' : 'hidden'}">💵 Currency: ${currency}</p>
          <p class="country__text ${country.population ? '' : 'hidden'}">🧑‍🤝‍🧑 Population: ${country.population}</p>
        </div>
        <div class="country__footer"><button type="button" class="place__button" id="country-back">Назад</button></div>
      </div>

    `
  answer.insertAdjacentHTML('beforeend', html)
}


async function getAndRenderCountry(alpha) {
  const data = await getCountryData(alpha)
  if (data.err) {
    renderError(data.text)
    return
  }
  renderCountryInfo(data[0])
}

export { getAndRenderCountry, getCountryAlpha }

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

async function loadImage(url) {
  try {
    // Load the image
    const response = await fetch(url);
    const blob = await response.blob();

    // Create an image element
    const image = new Image();
    image.src = URL.createObjectURL(blob);

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    return image.src

  } catch (error) {
    console.error('Error loading image:', error);
  }
}


async function renderCountryInfo(country) {
  const answer = document.querySelector('.answer')
  let currency
  let languages
  if (country.currencies) currency = Array.from(Object.keys(country.currencies), item => `${country.currencies[item].name} - ${country.currencies[item].symbol}`).join(',')
  if (country.languages) languages = Object.values(country.languages).join(', ')

  const flag = await loadImage(country.flags.png)

  const html = `
      <div class="country hidden">
      <div class="country__header">
        <img src="${flag}" alt="" class="country__flag">
        <h2 class="title__h2">${country.name.official}</h2>
      </div>
      <div class="country__body">
        <div class="country__row ${country.capital ? '' : 'hidden'}"><span class="country__sticker">🏙️</span><span class="country__text">Capital:
        ${country.capital}</span></div>
        <div class="country__row ${country.languages ? '' : 'hidden'}"><span class="country__sticker sticker-lang">🔈</span><span
            class="country__text">Languages: ${languages}</span></div>
        <div class="country__row ${currency ? '' : 'hidden'}"><span class="country__sticker">💵</span><span class="country__text">Currency:
        ${currency}</span></div>
        <div class="country__row ${country.population ? '' : 'hidden'}"><span class="country__sticker">🧑‍🤝‍🧑</span><span
            class="country__text">Population: ${country.population}</span></div>
      </div>
      <div class="country__footer"><button type="button" class="place__button button"
          id="country-back">Назад</button>
      </div>
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
  await renderCountryInfo(data[0])
}

export { getAndRenderCountry, getCountryAlpha }

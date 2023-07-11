import { getToken } from './secret.js'

async function getLocation(lat, long) {
  const place = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json&auth=${getToken()}`)
    .then(data => data.json())
    .then(data => {
      if (data.hasOwnProperty('error')) {
        const errorMessage = data.error.message ? data.error.message : data.error.description
        console.log(errorMessage)
        throw new Error(errorMessage)
      }
      return data
    }).catch(e => {
      return { text: e.message, err: true }
    })
  return place
}


function getLatAndLong() {
  const lat = document.querySelector('#latitude').value
  const long = document.querySelector('#longitude').value
  return [lat, long]
}


async function createPlaceAnswer() {
  const [lat, long] = await getLatAndLong()
  console.log(lat, long)
  const data = await getLocation(lat, long)
  await renderAnswer(data)
}


function renderPosition(data) {
  const answer = document.querySelector('.answer')

  let country
  let lowerCity
  console.log(data)
  if (data.standard) {
    lowerCity = data.standard.city ? data.standard.city.charAt(0).toUpperCase() + data.standard.city.slice(1).toLowerCase() : ''
    country = data.standard.countryname ? data.standard.countryname : ''
  } else {
    lowerCity = data.city ? data.city.charAt(0).toUpperCase() + data.city.slice(1).toLowerCase() : ''
    country = data.country ? data.country : ''
  }

  const position = [lowerCity, country].length ? [lowerCity, country].filter(str => str.length > 0).join(', ') : 'неизвестном месте'
  const btnHTML = country ? `<button type="button" class="place__button" data-country="${country}" id="country-alpha">Подробнее</button>` : ''

  const html = `
        <div class="place">
          <h2 class="place__title">
            Вы находитесь в<br>
            ${position}
          </h2>
            ${btnHTML}
        </div>
      `
  answer.innerHTML = html
}


function renderError(error) {
  const answer = document.querySelector('.answer')
  const html = `
      <div class="error">
        <h2 class="error__title">${error}</h2>
      </div>
  `
  answer.innerHTML = html
}


function renderAnswer(data) {
  if (data.hasOwnProperty('err')) {
    renderError(data.text)
    return
  }
  renderPosition(data)
}

export { createPlaceAnswer, renderError };


// getLocation(51.50354, -0.12768)
// await getLocation(51.50354, -0.12768)
// await getLocation(41.70377, 44.84219)

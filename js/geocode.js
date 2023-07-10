import { getToken } from './secret.js'

async function getLocation(lat, long) {
  const place = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json&auth=${getToken()}`)
    .then(data => data.json())
    .then(data => {
      console.log(data)
      if (data.hasOwnProperty('success') && !data.success) throw new Error(data.error.message)
      return data
    }).catch(e => {
      console.log(e)
      return { text: e, err: true }
    })

  return place
}

function renderPosition(country, city) {
  // работает в случае ошибки
  const answer = document.querySelector('.answer')
  const lowerCity = city ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() : ''
  const position = lowerCity ? `${lowerCity}, ${country}` : country
  const html = `
        <div class="place">
          <h2 class="place__title">
            Вы находитесь в<br>
            ${position}
          </h2>
          <button type="button" class="place__button" data-country="${country}">Подробнее</button>
        </div>
      `
  answer.innerHTML = html
}

const place = await getLocation(51.50354, -0.12768)
renderAnswer(place)


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
  renderPosition(data.country, data.city)
}

// getLocation(51.50354, -0.12768)
// await getLocation(51.50354, -0.12768)
// await getLocation(41.70377, 44.84219)

// https://geocode.xyz/51.50354,-0.12768?geoit=json&auth=414065910175045292594x45417
// https://geocode.xyz/51.50354,-0.12768?geoit=json
// https://geocode.xyz/35.756,139.256?geoit=json

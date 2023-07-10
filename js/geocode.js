import { getToken } from './secret.js'

const searchForm = document.querySelector('form')
searchForm.addEventListener('submit', (event) => {
  event.preventDefault()
  createPlaceAnswer()
})

async function getLocation(lat, long) {
  const place = await fetch(`https://geocode.xyz/${lat},${long}?geoit=json&auth=${getToken()}`)
    .then(data => data.json())
    .then(data => {
      console.log(data)
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
  const lowerCity = data.city ? data.city.charAt(0).toUpperCase() + data.city.slice(1).toLowerCase() : ''
  const country = data.country ? data.country : ''
  const position = [lowerCity, country].length ? [lowerCity, country].filter(str => str.length > 0).join(',') : 'неизвестном месте'
  const btnHTML = data.prov ? `<button type="button" class="place__button" data-country="${data.prov}">Подробнее</button>` : ''


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




// const place = await getLocation(51.50354, -0.12768)
// renderAnswer(place)


// getLocation(51.50354, -0.12768)
// await getLocation(51.50354, -0.12768)
// await getLocation(41.70377, 44.84219)

// https://geocode.xyz/51.50354,-0.12768?geoit=json&auth=414065910175045292594x45417
// https://geocode.xyz/51.50354,-0.12768?geoit=json
// https://geocode.xyz/35.756,139.256?geoit=json

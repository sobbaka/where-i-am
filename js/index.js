import { createPlaceAnswer } from './geocode.js';
import { getAndRenderCountry, getCountryAlpha } from './country.js';

const searchForm = document.querySelector('form')
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  await createPlaceAnswer()
  const countryBtn = await document.querySelector('#country-alpha')

  countryBtn.addEventListener('click', async () => {
    const alpha = await getCountryAlpha(countryBtn)
    await getAndRenderCountry(alpha)
  })
})

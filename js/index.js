import { createPlaceAnswer } from './geocode.js';
import { getAndRenderCountry, getCountryAlpha } from './country.js';

const searchForm = document.querySelector('form')
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  await createPlaceAnswer()
  const countryBtn = await document.querySelector('#country-alpha')
  if (countryBtn) {
    countryBtn.addEventListener('click', async () => {
      let country = document.querySelector('.country')
      const place = document.querySelector('.place')
      if (!country) {
        const alpha = getCountryAlpha(countryBtn)
        await getAndRenderCountry(alpha)
        country = document.querySelector('.country')
        toggleHiddenClass([place, country])
        const backToPositionBtn = document.querySelector('#country-back')
        backToPositionBtn.addEventListener('click', () => {
          toggleHiddenClass([place, country])
        })
      } else {
        toggleHiddenClass([place, country])
      }

    })
  }
})

function toggleHiddenClass(args) {
  args.forEach(item => item.classList.toggle('hidden'))
}

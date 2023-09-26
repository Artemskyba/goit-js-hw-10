import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import '../node_modules/slim-select/dist/slimselect.css';

import { fechCatsBreeds, fetchCatInfo } from './cat-api';

const breedSelectEl = document.querySelector('.breed-select');
const catInfoEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');

const slimSelect = new SlimSelect({
  select: breedSelectEl,
  settings: {
    placeholderText: 'Select a cat breed',
    searchPlaceholder: 'Select a cat breed',
  },
});

fechCatsBreeds()
  .then(breeds => renderBreedSelect(breeds))
  .catch(handleFetchError);

function renderBreedSelect(breeds) {
  const breedsData = breeds.map(({ id, name }) => {
    return { text: name, value: id };
  });
  breedsData.unshift({ text: '', placeholder: true });
  slimSelect.setData(breedsData);
  breedSelectEl.classList.remove('visually-hidden');
  loaderEl.classList.add('visually-hidden');
}

breedSelectEl.addEventListener('change', onSelectField);

function onSelectField() {
  loaderEl.classList.remove('visually-hidden');
  catInfoEl.classList.add('visually-hidden');
  fetchCatInfo(this.value)
    .then(catInfo => {
      if (catInfo.length === 0) {
        getErrorMessage(noCatInfoMessage, noCatDelay);
      }
      renderCatCardMarkup(catInfo);
    })
    .catch(handleFetchError);
}

function handleFetchError(error) {
  getErrorMessage(errorMessage, errorDelay);
}

function renderCatCardMarkup(catInfo) {
  const catCardMarkup = catInfo
    .map(({ url, breeds }) => {
      const breedInfoMarkup = breeds
        .map(({ description, id, name, temperament }) => {
          return `<img class="cat-img" src="${url}" alt="${id}"/>
            <h2 class="cat-breed">${name}</h2>
            <p class="cat-description">${description}</p>
            <p class="cat-temperament"><b>Temperament: </b>${temperament}</p>`;
        })
        .join('');
      return breedInfoMarkup;
    })
    .join('');
  catInfoEl.innerHTML = catCardMarkup;
  loaderEl.classList.add('visually-hidden');
  catInfoEl.classList.remove('visually-hidden');
}

const errorMessageData = {
  errorMessage: 'Oops! Something went wrong! Try reloading the page!',
  noCatInfoMessage:
    "We don't have information on this breed, please choose another one",
  errorDelay: 100000,
  noCatDelay: 1000,
};

const { errorMessage, noCatInfoMessage, errorDelay, noCatDelay } =
  errorMessageData;

function getErrorMessage(message, timeout) {
  loaderEl.classList.add('visually-hidden');
  Notiflix.Notify.failure(message, {
    position: 'center-center',
    timeout: timeout,
    width: '500px',
    fontSize: '25px',
    borderRadius: '35px',
    backOverlay: true,
  });
}

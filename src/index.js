import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import '../node_modules/slim-select/dist/slimselect.css';

import { fechCatsBreeds } from './cat-api';
import { fetchCatInfo } from './cat-api';

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
  .catch(error => {
    errorMessage(error);
  });

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
    .then(catInfo => renderCatCardMarkup(catInfo))
    .catch(error => {
      errorMessage();
    });
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

function errorMessage() {
  loaderEl.classList.add('visually-hidden');
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page!',
    {
      position: 'center-center',
      timeout: 100000,
      width: '500px',
      fontSize: '25px',
      borderRadius: '35px',
      backOverlay: true,
    }
  );
}
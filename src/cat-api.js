import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_KtW5wiUT0oWdCvrl2T4ASvtjwmmaA84BRAFCXJImumxTTTsDsQYclKdAfvQGFJGE';

export function fechCatsBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds').then(response => {
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.status);
    }
    return response.data;
  });
}

export function fetchCatInfo(catId) {
  return axios
    .get(`https://api.thecatapi.com/v1/images/search?breed_ids=${catId}`)
    .then(response => {
      if (
        response.status < 200 ||
        response.status >= 300 ||
        response.data.length === 0
      ) {
        throw new Error(response.status);
      }
      return response.data;
    });
}

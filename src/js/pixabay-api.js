import axios from 'axios';

const API_KEY = '38878394-a369e9a7eb6d5533d1860e3f1';

const API_BASE_URL = 'https://pixabay.com/api/';
export const pageLimit = 40;

const fetchImages = async (queryToFetch, pageToFetch) => {
  try {
    const { data } = await axios.get(API_BASE_URL, {
      params: {
        key: API_KEY,
        q: queryToFetch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: pageLimit,
        page: pageToFetch,
      },
    });

    return data;

  } catch (error) {
    onAxiosError(error);
  }
};

function onAxiosError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.log(error.response);
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error);
  }
}

export { fetchImages };

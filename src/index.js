import { fetchImages } from './js/pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const obj = {
  form: document.querySelector('#search-form'),
  formInput: document.querySelector('#search-form [name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('load__more'),
};

async function onSubmitForm(e) {
  e.preventDefault();

  const inputValue = obj.formInput.value;

  if (inputValue === '') {
    Notify.failure(`Enter, please, any value in the field.`);
    return false;
  }

  loadingImages(1, inputValue);
}

function loadingImages(page, value) {
  fetchImages(value, page)
    .then(data => {
      console.log(data);
      if (data.totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      if (data.totalHits !== 0) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
}

obj.form.addEventListener('submit', onSubmitForm);

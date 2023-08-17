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
  fetchImages(value, page).then(data => {
    console.log(data);
    const searchResults = data.hits;
    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (data.totalHits !== 0) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      photoCardTemplate(searchResults);
    }
  });
}

function photoCardTemplate(searchResults) {
  const markup = searchResults.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
    }
  );
  obj.gallery.insertAdjacentHTML('beforeend', markup.join(''));
}

obj.form.addEventListener('submit', onSubmitForm);

import { fetchImages, pageLimit } from './js/pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const obj = {
  form: document.querySelector('#search-form'),
  formInput: document.querySelector('#search-form [name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  scrollToTop: document.querySelector('.scroll__top'),
};

let gallerySimpleLightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 450,
  scrollZoom: false,
});

let pageNumber = 1;
let inputValue = null;
let numberOfPage = 0;

async function onSubmitForm(e) {
  e.preventDefault();
  pageNumber = 1;
  cleanGallery(obj.gallery);
  inputValue = obj.formInput.value;

  if (inputValue === '') {
    Notify.failure(`Enter, please, any value in the field.`);
    return false;
  }
  e.currentTarget.reset();
  try {
    await loadingImages(pageNumber, inputValue);
  } catch {
    onFetchError;
  }
}

async function loadingImages(page, value) {
  try {
    Loading.hourglass('Loading data, please wait...');
    const images = await fetchImages(value, page);
    const searchResults = images.hits;
    numberOfPage = Math.ceil(images.totalHits / pageLimit);

    if (images.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (images.totalHits !== 0) {
      Notify.success(`Hooray! We found ${images.totalHits} images.`);
      photoCardTemplate(searchResults);
      gallerySimpleLightbox.refresh();
    }

    if (images.totalHits > pageLimit) {
      window.addEventListener('scroll', throttle(onInfiniteScroll, 2000));
    }
  } catch {
    onFetchError;
  }
  Loading.remove();
}

function onInfiniteScroll() {
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
    loadMorePhotos();
  }
}

async function loadMorePhotos() {
  if (pageNumber === numberOfPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    window.removeEventListener('scroll', onInfiniteScroll);
    return;
  } else {
    Loading.hourglass('Loading data, please wait...');
    pageNumber += 1;

    try {
      const images = await fetchImages(inputValue, pageNumber);
      const searchResults = images.hits;
      photoCardTemplate(searchResults);
      gallerySimpleLightbox.refresh();
    } catch {
      onFetchError;
    }
    Loading.remove();
  }
}

function cleanGallery(el) {
  while (el.firstChild) {
    el.firstChild.remove();
  }
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

//Error handling
function onFetchError(error) {
  Notify.failure('Oops! Something went wrong! Try reloading the page!', {
    position: 'center-center',
    timeout: 5000,
    width: '400px',
    fontSize: '24px',
  });
}

function onTopScroll() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

obj.form.addEventListener('submit', onSubmitForm);
obj.scrollToTop.addEventListener('click', onTopScroll);

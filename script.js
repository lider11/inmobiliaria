const track = document.querySelector('.track');
const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('.nav-prev');
const nextBtn = document.querySelector('.nav-next');
const dotsContainer = document.querySelector('.dots');

let index = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', `Ir al video ${i + 1}`);
  dot.addEventListener('click', () => {
    index = i;
    updateCarousel();
  });
  dotsContainer.append(dot);
});

const dots = Array.from(document.querySelectorAll('.dot'));

function stopAllVideos() {
  slides.forEach((slide) => {
    const media = slide.querySelector('video');
    if (!media.paused) {
      media.pause();
    }
  });
}

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === slides.length - 1;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  dots.forEach((dot, i) => {
    dot.setAttribute('aria-current', String(i === index));
  });

  stopAllVideos();
}

prevBtn.addEventListener('click', () => {
  if (index > 0) {
    index -= 1;
    updateCarousel();
  }
});

nextBtn.addEventListener('click', () => {
  if (index < slides.length - 1) {
    index += 1;
    updateCarousel();
  }
});

updateCarousel();

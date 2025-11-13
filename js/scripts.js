export function offersCarousel() {
  const container = document.querySelector('.container-offers');
  const categories = container ? Array.from(container.querySelectorAll('.offers-category')) : [];
  if (!container || categories.length === 0) return;
  const titles = Array.from(document.querySelectorAll('.offers-category-title'));

function updateTitles(index){
  if(!titles.length) return;
  titles.forEach((t,i) => {
    const isActive = i === index;
    t.classList.toggle('active', isActive);
    t.classList.toggle('hidden', !isActive);

  });
}

  container.style.position = container.style.position || 'relative';

  const duration = 1500; 
  categories.forEach((el, i) => {
    el.style.position = 'absolute';
    el.style.top = '0';
    el.style.left = '0';
    el.style.width = '100%';
    el.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
    el.style.willChange = 'transform, opacity';

    if (el.classList.contains('active')) {
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
    } else {
      el.style.transform = 'translateX(100%)';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    }
  });

  let currentIndex = categories.findIndex(c => c.classList.contains('active'));
  if (currentIndex === -1) currentIndex = 0;

  updateTitles(currentIndex);

  function animateSwitch(fromIdx, toIdx, direction) {
    return new Promise(resolve => {
      const fromEl = categories[fromIdx];
      const toEl = categories[toIdx];


      toEl.style.transition = 'none';
      toEl.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
      toEl.style.opacity = '0';
      toEl.style.pointerEvents = 'none';

      void toEl.offsetWidth;


      toEl.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      fromEl.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;


      requestAnimationFrame(() => {
        fromEl.style.transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        fromEl.style.opacity = '0';
        fromEl.style.pointerEvents = 'none';

        toEl.style.transform = 'translateX(0)';
        toEl.style.opacity = '1';
        toEl.style.pointerEvents = 'auto';
      });

 
      let finished = 0;
      function onEnd() {
        finished += 1;
        if (finished === 2) { 
          fromEl.removeEventListener('transitionend', onEnd);
          toEl.removeEventListener('transitionend', onEnd);
          resolve();
        }
      }
      fromEl.addEventListener('transitionend', onEnd);
      toEl.addEventListener('transitionend', onEnd);
    });
  }

  function showIndex(newIndex, direction = 'next') {
    if (newIndex === currentIndex) return;
    const prevIndex = currentIndex;

    categories[prevIndex].classList.remove('active');
    categories[prevIndex].classList.add('hidden');
    categories[newIndex].classList.remove('hidden');
    categories[newIndex].classList.add('active');

    animateSwitch(prevIndex, newIndex, direction).then(() => {
      currentIndex = newIndex;
    });
    updateTitles(newIndex);
  }

  function nextCategory() {
    const newIndex = (currentIndex + 1) % categories.length;
    showIndex(newIndex, 'next');
  }
  function prevCategory() {
    const newIndex = (currentIndex - 1 + categories.length) % categories.length;
    showIndex(newIndex, 'prev');
  }

  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  if (nextBtn) nextBtn.addEventListener('click', nextCategory);
  if (prevBtn) prevBtn.addEventListener('click', prevCategory);

  categories.forEach((el, i) => {
    if (i === currentIndex) {
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';
      el.classList.add('active');
      el.classList.remove('hidden');
    } else {
      el.style.transform = 'translateX(100%)';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.classList.remove('active');
      el.classList.add('hidden');
    }
  });

  return { next: nextCategory, prev: prevCategory };
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.getElementById('navbarNavAltMarkup');

    // Usa la API oficial de Bootstrap para cerrar
    const collapse = bootstrap.Collapse.getInstance(nav);

    if (collapse) {
      collapse.hide();
    }
  });
});

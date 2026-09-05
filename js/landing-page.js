const landingNavLinks = [...document.querySelectorAll('.header-nav a[href^="#"]')];
const landingSections = landingNavLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const revealSections = [...document.querySelectorAll('main > section, .site-footer')];

document.documentElement.classList.add('js');

revealSections.forEach(section => {
  section.classList.add('reveal-section');
  [...section.children].forEach((child, childIndex) => {
    child.style.setProperty('--reveal-order', childIndex);
  });
});

if (revealSections.length) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
  );

  revealSections.forEach(section => revealObserver.observe(section));
}

const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('.header-nav');

const closeMobileMenu = () => {
  if (!menuToggle || !mainMenu) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  mainMenu.classList.remove('is-open');
};

if (menuToggle && mainMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    mainMenu.classList.toggle('is-open', !isOpen);
  });

  mainMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileMenu();
  });
}

const setActiveNavLink = sectionId => {
  landingNavLinks.forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${sectionId}`);
  });
};

landingNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    setActiveNavLink(link.getAttribute('href').slice(1));
  });
});

if (landingSections.length) {
  setActiveNavLink(landingSections[0].id);

  const sectionObserver = new IntersectionObserver(
    entries => {
      const visibleSection = entries
        .filter(entry => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleSection) setActiveNavLink(visibleSection.target.id);
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5, 1] }
  );

  landingSections.forEach(section => sectionObserver.observe(section));
}

const buttons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.page');
const collapseToggles = document.querySelectorAll('.collapse-toggle');

const updateNavBackground = section => {
  const paperBack = section.querySelector('.paper-back');
  const source = paperBack || section;
  const backgroundColor = getComputedStyle(source).backgroundColor;

  buttons.forEach(button => {
    button.style.backgroundColor = backgroundColor;
  });
};

buttons[0].classList.add('active');
updateNavBackground(document.getElementById(buttons[0].dataset.target));

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target; // reads data-target
    const targetSection = document.getElementById(target);

    sections.forEach(sec => {
      sec.classList.add('hidden'); // hide all
    });

    targetSection.classList.remove('hidden'); // show one
    targetSection.scrollTop = 0;
    targetSection.querySelectorAll('*').forEach(element => {
      element.scrollTop = 0;
    });
    updateNavBackground(targetSection);

    buttons.forEach(button => {
      button.classList.remove('active');
    });

    btn.classList.add('active');
  });
});

const initialTarget = window.location.hash.slice(1);
const initialButton = [...buttons].find(button => button.dataset.target === initialTarget);

if (initialButton) initialButton.click();

collapseToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const content = toggle.closest('.work-item').querySelector('p');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    toggle.setAttribute('aria-expanded', String(!isExpanded));
    content.classList.toggle('is-collapsed', isExpanded);
  });
});



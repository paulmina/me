const buttons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.page');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target; // reads data-target

    sections.forEach(sec => {
      sec.classList.add('hidden'); // hide all
    });

    document.getElementById(target).classList.remove('hidden'); // show one
  });
});
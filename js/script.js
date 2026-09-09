const buttons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.page');
const collapseToggles = document.querySelectorAll('.collapse-toggle');
const inquiryForm = document.querySelector('.inquiry-form');
const formStatus = document.querySelector('.form-status');
const inquiryThankYou = document.querySelector('.inquiry-thank-you');
const inquiryTypeInputs = document.querySelectorAll('input[name="Inquiry type"]');
const formModes = document.querySelectorAll('[data-form-mode]');

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

if (inquiryForm && formStatus && inquiryThankYou) {
  const updateInquiryMode = type => {
    const activeMode = type === 'Hire me' ? 'hire-me' : type === 'Other' ? 'other' : 'new-project';

    formModes.forEach(mode => {
      const isActive = mode.dataset.formMode === activeMode;
      mode.classList.toggle('hidden', !isActive);
      mode.querySelectorAll('input, textarea, select').forEach(control => {
        control.disabled = !isActive;
      });
    });
  };

  inquiryTypeInputs.forEach(input => {
    input.addEventListener('change', () => updateInquiryMode(input.value));
  });

  updateInquiryMode(document.querySelector('input[name="Inquiry type"]:checked').value);

  inquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    const selectedBuildTypes = inquiryForm.querySelectorAll('input[name="Building"]:checked');
    const inquiryType = document.querySelector('input[name="Inquiry type"]:checked').value;

    if (inquiryType === 'New project' && !selectedBuildTypes.length) {
      formStatus.textContent = 'Please choose at least one thing to build.';
      formStatus.classList.add('is-visible');
      inquiryForm.querySelector('input[name="Building"]').focus();
      return;
    }

    const submitButton = inquiryForm.querySelector('.inquiry-submit');
    submitButton.disabled = true;
    submitButton.classList.add('hidden');
    formStatus.classList.remove('is-visible');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    fetch(inquiryForm.action, {
      method: 'POST',
      body: new FormData(inquiryForm),
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) throw new Error('Submission failed');
        inquiryForm.classList.add('hidden');
        inquiryThankYou.classList.remove('hidden');
      })
      .catch(error => {
        formStatus.textContent = error.name === 'AbortError'
          ? 'The submission timed out. Please check your connection and try again.'
          : 'Something went wrong. Please try again.';
        formStatus.classList.add('is-visible');
        submitButton.disabled = false;
        submitButton.classList.remove('hidden');
      })
      .finally(() => {
        window.clearTimeout(timeout);
      });
  });
}



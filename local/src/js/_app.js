const menuTrigger = document.querySelector('.mobile_trigger');
const nav = document.querySelector('nav');
if (menuTrigger) {
  menuTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    menuTrigger.classList.toggle('--open');
    nav.classList.toggle('--open');
  });
}

const carSlider = document.querySelector('.slider');
// const sliderIndex = 0;
const initSlider = (slider, initIndex = 0) => {
  if (slider) {
    const slides = slider.querySelectorAll('.slider__slide');
    const prev = document.querySelector('.slider__arrow.--prev');
    const next = document.querySelector('.slider__arrow.--next');
    let active = slider.querySelector('.slider__slide.--active');
    const setSlider = (index) => {
      if (index > slides.length - 1) index = slides.length - 1;
      if (active) active.classList.remove('--active');
      slides[index].classList.add('--active');
      active = slider.querySelector('.slider__slide.--active');
      if (index === 0) prev.classList.add('--inactive');
      if (initIndex >= slides.length - 1) next.classList.add('--inactive');
      slider.style.transform = `translateX(${20 - index * 60}vw)`;
      return true;
    };
    setSlider(initIndex);
    if (prev) {
      prev.addEventListener('click', (e) => {
        e.preventDefault();
        if (initIndex === 0) {
          prev.classList.add('--inactive');
          return false;
        }
        next.classList.remove('--inactive');
        initIndex -= 1;
        setSlider(initIndex);
        return true;
      });
    }
    if (next) {
      next.addEventListener('click', (e) => {
        e.preventDefault();
        if (initIndex >= slides.length - 1) {
          next.classList.add('--inactive');
          return false;
        }
        prev.classList.remove('--inactive');
        initIndex += 1;
        setSlider(initIndex);
        return true;
      });
    }
    return true;
  }
  return false;
};
// initSlider(carSlider, sliderIndex);
initSlider(carSlider);

const carSelect = document.querySelector('.select');
// const selectIndex = 0
const initSelect = (select, initIndex = 0) => {
  if (select) {
    const trigger = select.querySelector('.select__trigger');
    const list = select.querySelector('.select__list');
    const options = select.querySelectorAll('.select__option');
    let active = select.querySelector('.select__option.--active');
    const setTrigger = (index) => {
      if (index < 0) index = 0;
      if (index > options.length - 1) index = options.length - 1;
      if (active) active.classList.remove('--active');
      options[index].classList.add('--active');
      active = select.querySelector('.select__option.--active');
      trigger.innerHTML = active.innerHTML;
    };
    setTrigger(initIndex);

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        list.classList.toggle('--active');
        trigger.classList.toggle('--active');
      });
    }

    options.forEach((option, index) => {
      option.dataset.index = index;
      option.addEventListener('click', (e) => {
        e.preventDefault();
        if (active) active.classList.remove('--active');
        options[index].classList.add('--active');
        active = select.querySelector('.select__option.--active');
        setTrigger(active.dataset.index);
        list.classList.remove('--active');
        trigger.classList.remove('--active');
      });
    });
  }
  return false;
};
// initSelect(carSelect, selectIndex);
initSelect(carSelect);

const validateInput = (input) => {
  const re = {
    letters: /.*[a-z]/gi,
    mail: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    // phone: /(^[+]+[0-9]{11,13}$)|(^[0-9]{9,12}$)/g,
    phone: /(^[0-9]{9}$)/g,
  };

  const addError = (required) => {
    if (input.querySelector('input').value !== '' || (required && input.querySelector('input').value === '')) input.querySelector('.form__error').classList.add('--active');
    return false;
  };

  const { value } = input.querySelector('input');
  const type = input.querySelector('input').dataset.validate;
  let match;
  let required = false;
  if (input.querySelector('input').required) required = true;

  switch (type) {
    case 'text':
      match = value.match(re.letters);
      if (!match) {
        return addError(required);
      }
      if (!(match[0] === value)) {
        return addError(required);
      }
      input.querySelector('.form__error').classList.remove('--active');
      break;
    case 'mail':
      match = value.match(re.mail);
      if (!match) {
        return addError(required);
      }
      if (!(match[0] === value)) {
        return addError(required);
      }
      break;
    case 'phone':
      match = value.match(re.phone);
      if (!match) {
        return addError(required);
      }
      if (!(match[0] === value)) {
        return addError(required);
      }
      break;
    default:
      return true;
  }
};

const inputs = document.querySelectorAll('.form__input');
if (inputs) {
  inputs.forEach((inputGroup) => {
    const input = inputGroup.querySelector('input');
    inputGroup.classList.remove('--active');
    inputGroup.querySelector('.form__error').classList.remove('--active');
    if (input.value !== '') inputGroup.classList.add('--active');

    const inputEvent = (e) => {
      e.preventDefault();
      inputGroup.querySelector('.form__error').classList.remove('.--active');
      inputGroup.classList.remove('--active');
      inputGroup.querySelector('.form__error').classList.remove('--active');
      if (input.value !== '') inputGroup.classList.add('--active');
      validateInput(inputGroup);
    };

    input.addEventListener('change', inputEvent, false);
    input.addEventListener('input', inputEvent, false);
  });
}

const expand = document.querySelector('.expand');
if (expand) {
  expand.addEventListener('click', (e) => {
    e.preventDefault();
    expand.nextSibling.classList.remove('d-none');
    expand.classList.add('d-none');
  });
}

const hide = document.querySelector('.hide');
if (hide) {
  hide.addEventListener('click', (e) => {
    e.preventDefault();
    const hidden = hide.closest('.hidden');
    hidden.classList.add('d-none')
    hidden.previousSibling.classList.remove('d-none');
  });
}

const submit = document.querySelector('.form__submit');
if (submit) {
  submit.addEventListener('click', (e) => {
    const data = {};
    data.car = document.querySelector('.select__trigger span').innerHTML;
    let valid = true;
    inputs.forEach((input) => {
      validateInput(input);
      const errors = document.querySelectorAll('.form__error.--active');
      if (errors.length > 0) {
        errors[0].closest('.form__input').scrollIntoView({
          behavior: 'smooth',
        });
        valid = false;
      }
      data[input.querySelector('input').id] = input.querySelector('input').value;
    });
    if (!valid) return false;
    const checkboxes = document.querySelectorAll('.form__checkbox');
    checkboxes.forEach((checkbox) => {
      data[checkbox.querySelector('input').id] = checkbox.querySelector('input').checked;
    });
    console.log(data);
  });
}

const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let results;

  // fall til að hreinsa öllum börnum ákveðins elements
  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // fall til að búa til element
  function el(name, ...children) {
    const element = document.createElement(name);

    for (let child of children) { /* eslint-disable-line */
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }

    return element;
  }

  // fall til að sýna skilaboð
  function showMessage(msg) {
    empty(results);
    results.appendChild(el('p', msg));
  }

  // fall til að sýna niðurstöður
  function showResults(items) {
    if (items.length === 0) {
      showMessage('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }

    empty(results);

    for (const item of items) { /* eslint-disable-line */
      const {
        name,
        sn,
        address,
        active,
      } = item;

      const result = el('div',
        el(
          'dl', el('dt', 'Nafn'),
          el('dd', name),
          el('dt', 'Kennitala'),
          el('dd', sn),
          address ? el('dt', 'Heimilisfang') : null,
          address ? el('dd', address) : null,
        ));

      result.classList.add('company');
      if (active) {
        result.classList.add('company--active');
      } else {
        result.classList.add('company--inactive');
      }
      results.appendChild(result);
    }
  }

  // fall til að sýna loading gif þegar verið er að sækja upplýsingar
  function showLoading() {
    empty(results);

    const img = document.createElement('img');
    img.setAttribute('alt', '');
    img.setAttribute('src', 'loading.gif');

    const loading = el('div', img, 'Leita að fyrirtækjum...');
    loading.classList.add('loading');

    results.appendChild(loading);
  }

  // fall til að sækja upplýsingar
  function fetchResults(company) {
    showLoading();

    fetch(`${API_URL}${company}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Non 200 status');
        }
        return res.json();
      })
      .then((data) => {
        showResults(data.results);
      })
      .catch((error) => {
        console.error('Villa við að sækja gögn', error);
        showMessage('Villa við að sækja gögn');
      });
  }

  // event handler fyrir leit að fyrirtæki
  function onSubmit(e) {
    e.preventDefault();

    const companyInput = input.value;

    if (typeof companyInput !== 'string' || companyInput === '') {
      showMessage('Fyrirtæki verður að vera strengur');
    } else {
      fetchResults(companyInput);
    }
  }

  // upphafsstilla víðværar breytur og búa til event handlera
  function init(companies) {
    const form = companies.querySelector('form');
    input = form.querySelector('input');
    results = companies.querySelector('.results');

    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');

  program.init(companies);
});

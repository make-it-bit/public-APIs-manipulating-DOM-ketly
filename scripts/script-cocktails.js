let searchMethod = null;

document.getElementById('search-method').addEventListener('change', () => {
  searchMethod = document.getElementById('search-method').value;
  if (document.getElementById('text-input')) {
    document.getElementById('text-input').value = '';
  }
  if (searchMethod === 'by-name' || searchMethod === 'by-ingredient') {
    displayAdditionalContent();
  } else {
    const additionalFields = document.querySelectorAll('.additional');
    if (additionalFields.length > 0) {
      for (let i = 0; i < additionalFields.length; i++) {
        additionalFields[i].remove();
      }
    }
  }
  return;
});

const displayAdditionalContent = () => {
  if (searchMethod === 'by-name') {
    additionalContent("What's the name of the desired cocktail?");
  } else if (searchMethod === 'by-ingredient') {
    additionalContent("What's the name of the desired ingredient?");
  }
};

const additionalContent = (labelText) => {
  const labels = document.querySelectorAll('label');
  let label = null;
  if (labels.length === 1) {
    label = document.createElement('label');
    label.setAttribute('class', 'additional');
    label.setAttribute('id', 'text-label');
    document.getElementById('submit-button').parentNode.insertBefore(label, document.getElementById('submit-button'));
    const input = document.createElement('input');
    input.setAttribute('class', 'additional');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'text-input');
    document.getElementById('submit-button').parentNode.insertBefore(input, document.getElementById('submit-button'));
  } else {
    label = labels[1];
  }
  label.innerText = labelText;
};

document.getElementById('submit-button').addEventListener('click', async () => {
  if (inputValidation()) {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.loader').style.display = 'block';
    let inputValue = null;
    if (searchMethod === 'by-random') {
      inputValue = '';
    } else {
      inputValue = document.getElementById('text-input').value;
    }
    const result = fetchData(inputValue);
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    if (responseValidation(result)) {
      displayResponse(result);
    }
  }
  return;
});

const fetchData = async (inputValue) => {
  try {
    let response = null;
    if (searchMethod === 'by-name') {
      response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputValue}`).then((res) => res.json());
    } else if (searchMethod === 'by-ingredient') {
      response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${inputValue}`).then((res) => res.json());
    } else if (searchMethod === 'by-random') {
      response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`).then((res) => res.json());
    }
    return response;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      alert('Vastust ei ole võimalik kuvada, sest siht-veebiaadress on vigane! Proovi uuesti!');
    } else {
      alert('Tekkis tundmatu probleem! Proovi uuesti!');
    }
    window.location.href = './cocktails.html';
    return;
  }
};

const displayResponse = (data) => {
  const container = document.querySelector('.container');
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  let arrayLength = 0;
  if (searchMethod === 'by-ingredient') {
    arrayLength = data.ingredients.length;
  } else if (searchMethod === 'by-name') {
    arrayLength = data.drinks.length;
  } else if (searchMethod === 'by-random') {
    arrayLength = 1;
  }

  for (let i = 0; i < arrayLength; i++) {
    const div = document.createElement('div');
    div.setAttribute('class', 'inner_container');
    container.append(div);
    if (searchMethod === 'by-ingredient') {
      const h1 = document.createElement('h1');
      h1.innerText = data.ingredients[i].strIngredient;
      div.appendChild(h1);
      const p = document.createElement('p');
      p.innerText = `ABV (alcohol by value): ${data.ingredients[i].strABV}`;
      div.appendChild(p);
    } else {
      const h1 = document.createElement('h1');
      h1.innerText = data.drinks[i].strDrink;
      div.appendChild(h1);
      const p = document.createElement('p');
      // if there is punctutation mark missing at the end of a sentence, "!" will be added!
      if (['.', '!', '?'].some((el) => data.drinks[i].strInstructions[data.drinks[i].strInstructions.length - 1].includes(el))) {
        p.innerText = data.drinks[i].strInstructions;
      } else {
        p.innerText = `${data.drinks[i].strInstructions}.`;
      }
      div.appendChild(p);
    }
  }
  const a = document.createElement('a');
  a.setAttribute('href', './cocktails.html');
  const againButton = document.createElement('button');
  againButton.innerText = 'GO AGAIN';
  a.append(againButton);
  container.append(a);
};

const inputValidation = () => {
  document.querySelector('.alert-message')?.remove();
  if (!searchMethod) {
    const p = document.createElement('p');
    p.setAttribute('class', 'alert-message');
    const label = document.getElementById('select-label');
    p.innerText = 'You must choose something from the list below before proceeding!';
    label.parentNode.insertBefore(p, label.nextSibling);
    return false;
  } else if (document.getElementById('text-input') && !document.getElementById('text-input').value) {
    const p = document.createElement('p');
    p.setAttribute('class', 'alert-message');
    const label = document.getElementById('text-label');
    p.innerText = 'You must type something in the textbox below before proceeding!';
    label.parentNode.insertBefore(p, label.nextSibling);
    return false;
  }
  return true;
};

const responseValidation = (response) => {
  document.querySelector('.alert-message')?.remove();
  if ((searchMethod === 'by-ingredient' && response.ingredients === null) || response.drinks === null) {
    const p = document.createElement('p');
    p.setAttribute('class', 'alert-message');
    const label = document.getElementById('text-label');
    p.innerText = 'The input is incorrect!';
    label.parentNode.insertBefore(p, label.nextSibling);
    return false;
  }
  return true;
};

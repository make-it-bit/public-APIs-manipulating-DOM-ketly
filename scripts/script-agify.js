document.getElementById('submit-button').addEventListener('click', async () => {
  const quantityOfNames = Number(document.getElementById('quantity-input').value);
  const names = document.getElementById('names-input').value.split(',');
  if (inputValidation({ quantityOfNames, names })) {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.loader').style.display = 'block';
    const result = await fetchData({ quantityOfNames, names });
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    if (responseValidation({ result, quantityOfNames })) {
      if (quantityOfNames === 1) {
        displayResponse([result]);
      } else {
        displayResponse(result);
      }
    }
  }
  return;
});

const inputValidation = (input) => {
  document.querySelector('.alert-message')?.remove();

  if (!input.quantityOfNames) {
    const label = document.getElementById('quantity-label');
    const p = document.createElement('p');
    p.setAttribute('class', 'alert-message');
    p.innerText = 'You must choose the quantity before proceeding!';
    label.parentNode.insertBefore(p, label.nextSibling);
    return false;
  } else if (input.names[0] === '') {
    const label = document.getElementById('names-label');
    const p = document.createElement('p');
    p.setAttribute('class', 'alert-message');
    p.innerText = 'You must choose names before proceeding!';
    label.parentNode.insertBefore(p, label.nextSibling);
    return false;
  } else if (input.quantityOfNames != input.names.length) {
    const label = document.getElementById('quantity-label');
    const p = document.createElement('p');
    p.setAttribute('class', 'alert-message');
    p.innerText = 'The values of input fields does not match! Try again!';
    label.parentNode.insertBefore(p, label);
    return false;
  } else {
    return true;
  }
};

const fetchData = async (input) => {
  try {
    let response = null;
    if (input.quantityOfNames === 1) {
      response = await fetch(`https://api.agify.io?name=${input.names[0]}`).then((res) => res.json());
    } else {
      let endpoint = 'https://api.agify.io?';
      for (let i = 0; i < input.quantityOfNames; i++) {
        if (i === input.quantityOfNames - 1) {
          endpoint += `name[]=${input.names[i]}`;
        } else {
          endpoint += `name[]=${input.names[i]}&`;
        }
      }
      response = await fetch(endpoint).then((res) => res.json());
    }
    return response;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      alert('Vastust ei ole võimalik kuvada, sest siht-veebiaadress on vigane! Proovi uuesti!');
    } else {
      alert('Tekkis tundmatu probleem! Proovi uuesti!');
    }
    window.location.href = './agify.html';
    return;
  }
};

const responseValidation = (data) => {
  if (data.quantityOfNames === 1) {
    data.result = [data.result];
  }
  for (let i = 0; i < data.result.length; i++) {
    if (data.result[i].age === null) {
      const label = document.getElementById('quantity-label');
      const p = document.createElement('p');
      p.setAttribute('class', 'alert-message');
      p.innerText = 'The input is incorrect!';
      label.parentNode.insertBefore(p, label);
      return false;
    }
  }
  return true;
};

const displayResponse = (data) => {
  const container = document.querySelector('.container');
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  for (let i = 0; i < data.length; i++) {
    const div = document.createElement('div');
    div.setAttribute('class', 'inner_container');
    container.append(div);
    const p1 = document.createElement('p');
    p1.innerHTML = `<span>Name:</span> ${data[i].name}`;
    div.appendChild(p1);
    const p2 = document.createElement('p');
    p2.innerHTML = `<span>Predicted age:</span> ${data[i].age}`;
    div.appendChild(p2);
  }
  const a = document.createElement('a');
  a.setAttribute('href', './agify.html');
  const againButton = document.createElement('button');
  againButton.innerText = 'GO AGAIN';
  a.append(againButton);
  container.append(a);
};

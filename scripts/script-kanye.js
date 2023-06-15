document.getElementById('generate-button').addEventListener('click', () => {
  document.querySelector('.container').style.display = 'none';
  document.querySelector('.loader').style.display = 'block';
  fetchData().then((result) => {
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    displayResponse(result);
  });
});

const fetchData = async () => {
  try {
    const data = await fetch('https://api.kanye.rest/').then((res) => res.json());
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      if (error.message === 'Failed to fetch') {
        alert('Vastust ei ole võimalik kuvada, sest siht-veebiaadress on vigane! Proovi uuesti!');
        window.location.href = './kanye.html';
      }
    }
  }
};

const displayResponse = (data) => {
  const container = document.querySelector('.container');
  const h1 = document.querySelector('h1');
  const generateButton = document.getElementById('generate-button');

  if (['.', '!', '?'].some((el) => data.quote[data.quote.length - 1].includes(el))) {
    h1.innerHTML = `Kanye: <span>"${data.quote}"</span>`;
  } else {
    h1.innerHTML = `Kanye: <span>"${data.quote}!"</span>`;
  }

  if (generateButton.innerText != 'GENERATE AGAIN') {
    generateButton.innerText = 'GENERATE AGAIN';
    const a = document.createElement('a');
    a.setAttribute('href', './kanye.html');
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'CANCEL';
    a.append(cancelButton);
    container.append(a);
  }
};

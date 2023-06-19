document.getElementById('generate-button').addEventListener('click', async () => {
  document.querySelector('.container').style.display = 'none';
  document.querySelector('.loader').style.display = 'block';
  const result = await fetchData();
  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.container').style.display = 'block';
  displayResponse(result);
  return;
});

const fetchData = async () => {
  try {
    const data = await fetch('https://api.kanye.rest/').then((res) => res.json());
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      alert('Vastust ei ole võimalik kuvada, sest siht-veebiaadress on vigane! Proovi uuesti!');
    } else {
      alert('Tekkis tundmatu probleem! Proovi uuesti!');
    }
    window.location.href = './kanye.html';
    return;
  }
};

const displayResponse = (data) => {
  // if there is punctutation mark missing at the end of a sentence, "!" will be added!
  if (['.', '!', '?'].some((el) => data.quote[data.quote.length - 1].includes(el))) {
    document.querySelector('h1').innerHTML = `Kanye: <span>"${data.quote}"</span>`;
  } else {
    document.querySelector('h1').innerHTML = `Kanye: <span>"${data.quote}!"</span>`;
  }

  if (document.getElementById('generate-button').innerText != 'GENERATE AGAIN') {
    document.getElementById('generate-button').innerText = 'GENERATE AGAIN';
    const a = document.createElement('a');
    a.setAttribute('href', './kanye.html');
    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'CANCEL';
    a.append(cancelButton);
    document.querySelector('.container').append(a);
  }
};

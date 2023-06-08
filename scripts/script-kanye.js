const main = () => {
  const loader = document.querySelector(".loader");
  display_loading(loader);
  const data = fetch_data();
  data.then((result) => {
    hide_loading(loader);
    console.log(result);
    display_response(result);
  });
};

document.querySelector("button").addEventListener("click", main);

const fetch_data = async () => {
  try {
    const response = await fetch("https://api.kanye.rest/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const display_response = (data) => {
  const content = document.querySelector(".content");
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  content.append(div);

  const h1 = document.createElement("h1");
  div.append(h1);
  h1.innerHTML = `Kanye: <span>"${data.quote}!"</span>`;

  const again_button = document.createElement("button");
  again_button.setAttribute("onClick", "main()");
  again_button.innerText = "GENERATE AGAIN";
  div.append(again_button);

  const cancel_button = document.createElement("button");
  const a = document.createElement("a");
  a.setAttribute("href", "./kanye.html");
  a.innerText = "CANCEL";
  cancel_button.append(a);
  div.append(cancel_button);
};

const display_loading = (loader) => {
  const content = document.querySelector(".content");
  const form = document.querySelector("form");
  const container = document.querySelector(".container");
  if (content.contains(form)) {
    form.remove();
  } else if (content.contains(container)) {
    container.remove();
  }
  loader.classList.add("display");
};

const hide_loading = (loader) => {
  loader.classList.remove("display");
};

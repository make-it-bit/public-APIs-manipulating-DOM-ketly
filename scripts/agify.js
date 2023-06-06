const submit_button = document.querySelector("input[type='submit']");

submit_button.addEventListener("click", (event) => {
  event.preventDefault();

  const quantity_of_names = Number(
    document.querySelector("input[type='number']").value
  );
  const names = document.querySelector("input[type='text']").value.split(",");

  if (!quantity_of_names || names[0] === "") {
    alert("All the input fields must have a value!");
    window.location.href = "./agify.html";
  } else if (quantity_of_names != names.length) {
    alert("The values of input fields doesn't match! Try again!");
    window.location.href = "./agify.html";
  }

  const loader = document.querySelector(".loader");
  display_loading(loader);
  const data = fetch_data(quantity_of_names, names);
  data.then((result) => {
    hide_loading(loader);
    if (quantity_of_names === 1) {
      modify_dom([result]);
    } else {
      modify_dom(result);
    }
  });
});

const fetch_data = async (quantity_of_names, names) => {
  try {
    let response = null;
    if (quantity_of_names === 1) {
      response = await fetch(`https://api.agify.io?name=${names[0]}`);
    } else {
      let endpoint = "https://api.agify.io?";
      for (let i = 0; i < quantity_of_names; i++) {
        if (i === quantity_of_names - 1) {
          endpoint += `name[]=${names[i]}`;
        } else {
          endpoint += `name[]=${names[i]}&`;
        }
      }
      response = await fetch(endpoint);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const modify_dom = (data) => {
  const content = document.querySelector(".content");
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  content.append(div);

  for (let i = 0; i < data.length; i++) {
    const inner_div = document.createElement("div");
    inner_div.setAttribute("class", "inner_container");
    div.append(inner_div);

    const p_name = document.createElement("p");
    p_name.innerText = `Name: ${data[i].name}`;
    const p_age = document.createElement("p");
    p_age.innerText = `Predicted age: ${data[i].age}`;
    inner_div.appendChild(p_name);
    inner_div.appendChild(p_age);
  }

  const button = document.createElement("button");
  const a = document.createElement("a");
  a.setAttribute("href", "./agify.html");
  a.innerText = "GO AGAIN";
  button.append(a);
  div.append(button);
};

const display_loading = (loader) => {
  const form = document.querySelector("form");
  form.remove();

  console.log("loading started...");
  loader.classList.add("display");
};

const hide_loading = (loader) => {
  console.log("loading ended...");
  loader.classList.remove("display");
};
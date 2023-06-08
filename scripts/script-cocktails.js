let index_of_choice = 0;
const submit_button = document.querySelector("input[type='submit']");

submit_button.addEventListener("click", (event) => {
  event.preventDefault();

  if (submit_button.classList.contains("added")) {
    const input_value = document.querySelector("input[type='text']").value;
    if (input_value == "") {
      alert("The input was empty! Try again!");
      window.location.href = "./cocktails.html";
    } else {
      main(input_value, index_of_choice);
    }
  } else {
    const selected_option = document.querySelector("select").value;
    if (!selected_option) {
      alert("You must choose something from the list below before proceeding!");
      window.location.href = "./cocktails.html";
    } else {
      index_of_choice = display_additional_content(selected_option);
      if (index_of_choice === 3) {
        main("", index_of_choice);
      }
    }
  }
});

const main = (input_value, index_of_choice) => {
  const loader = document.querySelector(".loader");
  display_loading(loader);
  const data = fetch_data(input_value, index_of_choice);
  data.then((result) => {
    hide_loading(loader);
    if (validate_response(result, index_of_choice)) {
      display_response(result, index_of_choice);
    } else {
      alert("The entered values are not in correct form! Try again!");
      window.location.href = "./cocktails.html";
    }
  });
};

const fetch_data = async (input_value, index_of_choice) => {
  try {
    let response = null;
    if (index_of_choice === 1) {
      response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input_value}`
      );
    } else if (index_of_choice === 2) {
      response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${input_value}`
      );
    } else if (index_of_choice === 3) {
      response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/random.php`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const display_additional_content = (selected_option) => {
  if (selected_option === "by-name") {
    additional_content("What's the name of the desired cocktail?");
    return 1;
  } else if (selected_option === "by-ingredient") {
    additional_content("What's the name of the desired ingredient?");
    return 2;
  } else if (selected_option === "by-random") {
    submit_button.setAttribute("class", "added");
    return 3;
  }
};

const additional_content = (label_text) => {
  document.querySelector("label").remove();
  document.querySelector("select").remove();

  submit_button.setAttribute("class", "added");
  const submit_link = document.querySelector("#submit");

  const label = document.createElement("label");
  label.innerText = label_text;
  submit_link.parentNode.insertBefore(label, submit_link);
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  submit_link.parentNode.insertBefore(input, submit_link);
};

const validate_response = (response, index_of_choice) => {
  if (index_of_choice === 2 && response.ingredients === null) {
    return false;
  } else if (response.drinks === null) {
    return false;
  }
  return true;
};

const display_response = (data, index_of_choice) => {
  const content = document.querySelector(".content");
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  content.append(div);

  let array_length = 0;
  if (index_of_choice === 2) {
    array_length = data.ingredients.length;
  } else {
    array_length = data.drinks.length;
  }

  for (let i = 0; i < array_length; i++) {
    const inner_div = document.createElement("div");
    inner_div.setAttribute("class", "inner_container");
    div.append(inner_div);

    if (index_of_choice === 2) {
      const h1_name = document.createElement("h1");
      h1_name.innerText = data.ingredients[i].strIngredient;
      const p_abv = document.createElement("p");
      p_abv.innerText = `ABV (alcohol by value): ${data.ingredients[i].strABV}`;
      inner_div.appendChild(h1_name);
      inner_div.appendChild(p_abv);
    } else {
      const h1_name = document.createElement("h1");
      h1_name.innerText = data.drinks[i].strDrink;
      const p_recipe = document.createElement("p");
      p_recipe.innerText = data.drinks[i].strInstructions;
      inner_div.appendChild(h1_name);
      inner_div.appendChild(p_recipe);
    }
  }

  const button = document.createElement("button");
  const a = document.createElement("a");
  a.setAttribute("href", "./cocktails.html");
  a.innerText = "GO AGAIN";
  button.append(a);
  div.append(button);
};

const display_loading = (loader) => {
  const form = document.querySelector("form");
  form.remove();

  loader.classList.add("display");
};

const hide_loading = (loader) => {
  loader.classList.remove("display");
};

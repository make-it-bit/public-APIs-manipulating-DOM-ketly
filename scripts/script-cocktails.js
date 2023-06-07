let index_of_choice = 0;

document
  .querySelector("input[type='submit']")
  .addEventListener("click", (event) => {
    event.preventDefault();

    if (
      document.querySelector("input[type='submit']").classList.contains("added")
    ) {
      const input_value = document.querySelector("input[type='text']").value;
      const data = fetch_data(input_value, index_of_choice);
      data.then((result) => {
        console.log(result);
      });
    } else {
      const selected_option = document.querySelector("select").value;
      if (!selected_option) {
        alert(
          "You must choose something from the list below before proceeding!"
        );
        window.location.href = "./cocktails.html";
      } else {
        index_of_choice = display_additional_content(selected_option);
        if (index_of_choice === 3) {
          const data = fetch_data("", index_of_choice);
          data.then((result) => {
            console.log(result);
          });
        }
      }
    }
  });

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
    return 3;
  }
};

const additional_content = (label_text) => {
  document.querySelector("label").remove();
  document.querySelector("select").remove();
  document.querySelector("input[type='submit'").setAttribute("class", "added");

  const form = document.querySelector("form");
  const submit_button = document.querySelector("#submit");

  const label = document.createElement("label");
  label.innerText = label_text;
  submit_button.parentNode.insertBefore(label, submit_button);
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  submit_button.parentNode.insertBefore(input, submit_button);
};

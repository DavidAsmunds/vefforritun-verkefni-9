import { search } from "./api";
import { el, empty } from "./elements";
import { sleep } from "./helpers";

/**
 * @param {HTMLElement} artSearcher
 */
export function searchFrom(artSearcher) {
  const statusElement = el("p", {}, "Sláðu inn leitarorð til að byrja.");
  const resultsElement = el("ul");
  const resultElement = el("div", {}, statusElement, resultsElement);

  const inputElement = document.createElement("input");
  inputElement.setAttribute("name", "query");

  /**
   *
   * @param {Event} e Form submit event.
   */
  async function onSubmitHandler(e) {
    e.preventDefault();
    empty(resultsElement);

    const query = inputElement.value;
    statusElement.textContent = `Leita að ${query}...`;

    await sleep(0.5);
    const results = await search(query);
    console.log("niðurstöður!", results);

    statusElement.textContent = `Leitarniðurstöður fyrir ${query}:`;

    if (!results) {
      statusElement.textContent = `Villa við leit!`;
      return;
    }

    const data = results.data;

    for (const item of data) {
      const text = item.title;
      const id = item.id;

      const resultItem = el("li", {}, el("a", { href: "/?id=" + id }, text));

      resultsElement.appendChild(resultItem);
    }
  }

  artSearcher?.appendChild(
    el("p",{},"Veldu listaverk:")
  );
  const formElement = el(
    "form",
    { submit: onSubmitHandler },
    inputElement,
    el("button", { type: "submit" }, "Leita")
  );

  artSearcher?.appendChild(formElement);
  artSearcher?.appendChild(resultElement);
}
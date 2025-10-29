import { searchFrom } from "./lib/art.js";
import { el } from "./lib/elements.js";
import { sleep,error } from "./lib/helpers.js";
//held ég eigi ekki að jsdoc-ca þetta fyrir neðan
const artSearcher = document.querySelector(".art-searcher");

const id = new URLSearchParams(window.location.search).get("id");

if (artSearcher instanceof HTMLElement) {
  if (id) {
    (async () => {
      try{
        const {image_id,title,short_description,width} = await searchById(id);
        if (!image_id) {
          artSearcher.appendChild(el("p", {}, `ekkert id`));
        }
        artSearcher.appendChild(el("h3", {}, `${title}`));
        artSearcher.appendChild(
          el("img",{
            src: `https://www.artic.edu/iiif/2/${image_id}/full/${width},/0/default.jpg`,
            alt: `Listaverk ${id}`,
            title: `${title}`,
            loading: "lazy"
          })
        )
        if(short_description!=null){
          artSearcher.appendChild( el("p", {}, `${short_description}`));
        }
        artSearcher.appendChild( el("a", { href: "index.html" }, "Aftur á leitarsíðu"));
      }
      catch(err){
        artSearcher.appendChild(el("p", {}, "eittvað vesen við að sækja gögn og að sækja mynd"));
        error("id vesen",err);  
      }
    })();
    
    
  } else {
    searchFrom(artSearcher);
  }
}

/**
 * Takes in an id, and then gets the relevant data from the ACI API
 * @param {id} int
 * @returns {Promise<{image_id: string|null, title: string|null, short_description: string|null}>}
 */
async function searchById(id) {
  try{
    const gogn = await fetch(
      `https://api.artic.edu/api/v1/artworks/${id}`
    );
    await sleep(0.5);

    if (!gogn.ok) throw new Error("200");    
    
    const { data } = await gogn.json();
    
    const image_id = data.image_id;
    const title = data.title;
    const short_description = data.short_description;
    const width = data.thumbnail.width;

    return {image_id,title,short_description,width};
  }
  catch (err) {
    error("næst ekki að sækja gögn, id eflausti invalid",err);
    return{ image_id: null, title: null, short_description:null };
  }
}
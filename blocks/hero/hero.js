import { fetchPlaceholders }
from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const { more, stuff } = placeholders;
  window.console.log("more: " + more);
  window.console.log("stuff: " + stuff);  
}
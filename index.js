import WromoLoader from './data-wromo-id.js';

// We export a direct initialization function (optional, but practical)
export const init = (url) => {
  return WromoLoader.init(url);
};

// We export the main object as default
export default WromoLoader;

// If someone uses it directly in a browser ecosystem
if (typeof window !== 'undefined') {
  window.WromoLoader = WromoLoader;
}

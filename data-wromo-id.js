/**
 * Wromo Data Loader local version v2.3 (Dynamic Domain & Anti-Flash) by Wromo Team
 * Signed by Iulian Ghepes (https://iulian.ghepes.com)
 * This script is responsible for dynamically loading data into the page based on a JSON file specific to each page.
 * Features v1.0.1 License: MIT
 * Official Repository: https://github.com/Ghepes/data-wromo-id   v1.0.1
 */

    // --- 0. ANTI-FLASH SETUP (Imediat) ---
    // We inject a CSS style to hide the elements until the data is loaded
    const style = document.createElement('style');
    style.innerHTML = `
        [data_wromo_id] { 
            opacity: 0; 
            transition: opacity 0.3s ease-in; 
        }
        [data_wromo_id].wromo-ready { 
            opacity: 1; 
        }
    `;
    document.head.appendChild(style);

    const WromoLoader = {
        config: {
            // We dynamically calculate the data folder based on the current domain and a fixed path. This allows the same code to work across different environments without hardcoding URLs.
            // Ex: If you are on https://xo.example.org -> https://xo.example.org/data/
            baseDataUrl: window.location.origin + '/data/', 
            attributeName: 'data_wromo_id'
        },

        init: function (overrideUrl) {
            // We allow overwriting if there is a specific URL in the script tag
            if (overrideUrl) {
                this.config.baseDataUrl = overrideUrl;
            }

            // 1. Detecting the name of the current page / subdirectory
            let path = window.location.pathname;
            
            // We remove the .html extension if it exists (ex: "/blog/index.html" becomes "/blog/index")
            path = path.replace('.html', '');
            
            if (path.endsWith('/') && path.length > 1) {
                path = path.slice(0, -1);
            }

            // We split the path into clean segments (ex: removing empty strings: ["blog", "index"])
            let segments = path.split('/').filter(Boolean);
            
            let pageName = 'index';
            
            if (segments.length > 0) {
                let lastSegment = segments[segments.length - 1];
                
                // case: if it's "index" in a subdirectory (ex: /blog/index), the real name is the parent folder ("blog")
                if (lastSegment === 'index' && segments.length > 1) {
                    pageName = segments[segments.length - 2];
                } else {
                    pageName = lastSegment;
                }
            }

            // 2. Constructing the JSON file name based on the page name
            const jsonFileName = `${pageName}_structure.json`;
            const fullUrl = this.config.baseDataUrl + jsonFileName;

            // console.log (`WromoLoader: Fetching data from ${fullUrl}`);
            this.load(fullUrl);
        },

        load: async function (fetchUrl) {
            try {
                // Add timestamp to avoid browser caching
                const urlWithCacheBust = `${fetchUrl}?t=${Date.now()}`;
                const response = await fetch(urlWithCacheBust);

                if (!response.ok) throw new Error(`Failed to load JSON: ${response.status}`);

                const data = await response.json();
                
                // We wait for the DOM to be ready before applying the data. This ensures that all elements are present before we try to manipulate them.
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.applyData(data));
                } else {
                    this.applyData(data);
                }

            } catch (error) {
                console.warn('WromoLoader: Could not load structure file.', error);
                // Even if we have an error, we display the content (fallback)
                this.revealContent();
            }
        },

        applyData: function (jsonData) {
            let itemsRaw;
            
            // Normalizare structura JSON
            if (jsonData.elements && Array.isArray(jsonData.elements)) {
                itemsRaw = jsonData.elements;
            } else {
                itemsRaw = jsonData;
            }

            const items = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

            // Quick access mapping of id -> data for faster lookups
            const dataMap = new Map();
            items.forEach(item => {
                if (item.id) dataMap.set(item.id, item);
            });

            // We select the elements on the page that have the data_wromo_id attribute and apply the corresponding data from the JSON. This is done in a single pass for efficiency.
            const elements = document.querySelectorAll(`[${this.config.attributeName}]`);

            elements.forEach(element => {
                const wromoId = element.getAttribute(this.config.attributeName);
                if (!wromoId) return;

                const itemData = dataMap.get(wromoId);
                
                // If we have data, we apply it based on the type of element. This allows us to handle images, links, and text inputs in a flexible way.
                if (itemData) {
                    // 1. IMAGES
                    if (element.tagName === 'IMG') {
                        if (itemData.src) element.src = itemData.src;
                        else if (itemData.content && itemData.content.startsWith('http')) element.src = itemData.content;
                    }
                    // 2. LINKS
                    else if (element.tagName === 'A') {
                        if (itemData.content) element.textContent = itemData.content;
                        if (itemData.href) element.href = itemData.href;
                        if (itemData.url) element.href = itemData.url;
                    }
                    // IFRAMES
                    else if (element.tagName === 'IFRAME') {
                        let currentSrc = element.getAttribute('src');
                        if (currentSrc) {
                            // 1. change the Video ID between "/embed/" and "?"
                            if (itemData.videoId) {
                                currentSrc = currentSrc.replace(/\/embed\/([A-Za-z0-9_-]+)/, `/embed/${itemData.videoId}`);
                            }
                            // 2. change the domain "domain.com" wherever it appears in the URL (plain or encoded)
                            if (itemData.domain) {
                                currentSrc = currentSrc.replaceAll('ghepes.com', itemData.domain);
                            }
                            element.setAttribute('src', currentSrc);
                        }
                    }
                    // 3. INPUTS / TEXT
                    else {
                        if (itemData.content !== undefined) {
                            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                                element.value = itemData.content;
                            } else {
                                element.innerHTML = itemData.content;
                            }
                        }
                    }

                    // 4. ATTRIBUTES
                    if (itemData.attributes) {
                        for (const [attr, val] of Object.entries(itemData.attributes)) {
                            element.setAttribute(attr, val);
                        }
                    }
                }
            });

            // FINAL: Showing updated content (removing anti-flash)
            this.revealContent();
        },

       revealContent: function() {
            // We add the class that makes the elements visible (opacity 1)
            const elements = document.querySelectorAll(`[${this.config.attributeName}]`);
            elements.forEach(el => el.classList.add('wromo-ready'));
        }
    };

// --- HYBRID CONFIGURATION (BROWSER + NPM) ---

// Direct exposure in the browser
if (typeof window !== 'undefined') {
  window.WromoLoader = WromoLoader;

  // Smart auto-init (works both as a normal script and as a module)
  const currentScript = document.currentScript || document.querySelector('script[src*="data-wromo-id.js"]');
  
  if (currentScript) {
    let overrideUrl = null;
    if (currentScript.dataset.url) {
      overrideUrl = currentScript.dataset.url;
    }
    WromoLoader.init(overrideUrl);
  }
}

// The official export for your NPM package / ES Modules environment
export default WromoLoader;

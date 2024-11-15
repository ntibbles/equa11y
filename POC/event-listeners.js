export function highlightNonInteractiveElements(isChecked) {
    // Define the list of non-interactive elements to target
    const nonInteractiveElements = ['div', 'span', 'p', 'section', 'article', 'header', 'footer'];
  
    // Loop through all elements on the page
    const els = document.querySelectorAll(nonInteractiveElements.join(','));
   
    els.forEach(element => {
      let listeners = element.getEventListeners();
      console.log('listeners: ', listeners);
      if (isChecked && Object.keys(listeners).length) {
        // Create the label
        const label = document.createElement('div');
        label.textContent = `${element.tagName.toLowerCase()}: ${Object.keys(listeners)[0]}`;
        label.style.position = 'absolute';
        label.style.top = '0';
        label.style.left = '0';
        label.style.padding = '2px 4px';
        label.style.backgroundColor = 'blue';
        label.style.color = 'white';
        label.style.fontSize = '12px';
        label.style.zIndex = '1000';
  
        // Position the label
        const rect = element.getBoundingClientRect();
        label.style.top = `${rect.top + window.scrollY}px`;
        label.style.left = `${rect.left + window.scrollX}px`;
  
        // Give the element an outline and append the label
        element.style.outline = '2px solid blue';
        element.appendChild(label);
        element.dataset.hasLabel = 'true';  // Set a flag to identify labeled elements
      } else if (!isChecked && element.dataset.hasLabel) {
        // Remove label and outline if isChecked is false
        element.style.outline = '';
        const label = element.querySelector('div');
        if (label) label.remove();
        delete element.dataset.hasLabel;
      }
    });
  }
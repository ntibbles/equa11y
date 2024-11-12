// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// const types = {};
// chrome.devtools.inspectedWindow.getResources((resources) => {
//   resources.forEach((resource) => {
//     if (!(resource.type in types)) {
//       types[resource.type] = 0;
//     }
//     types[resource.type] += 1;
//   });
//   let result = `Resources on this page: 
//   ${Object.entries(types)
//     .map((entry) => {
//       const [type, count] = entry;
//       return `${type}: ${count}`;
//     })
//     .join('\n')}`;
//   let div = document.createElement('div');
//   div.innerText = result;
//   document.body.appendChild(div);
// });

// console.log('getEventListeners: ', DOMDebugger.getEventListeners);
document.getElementById('outline').addEventListener('click', () => {
  chrome.devtools.inspectedWindow.getResources((resources) => {
    resources[0].getContent((resp) => { 
      const dom = new DOMParser();
      const doc = dom.parseFromString(resp, "text/html");
      outline(doc);
    });
  });
});

function outline(doc) {
    // Define the list of non-interactive elements to target
    const nonInteractiveElements = ['div', 'span', 'p', 'section', 'article', 'header', 'footer'];
    const isChecked = true;
    // Loop through all elements on the page
    const els = doc.querySelectorAll(nonInteractiveElements.join(','));
    console.log('run outline: ', els);
    els.forEach(element => {
      let listeners = getEventListeners(element);
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
};
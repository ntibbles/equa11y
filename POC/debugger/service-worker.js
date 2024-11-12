function onAttach(tabId) {
  // Debugger attached successfully
  
  const nonInteractiveElements = ['div', 'span', 'p', 'section', 'article', 'header', 'footer'];
  
  getNodeDetails(tabId, nonInteractiveElements.join(','))
  .then(nodes => {
    nodes.forEach(node => {
      getListeners(tabId, node.objectId)
      .then(resp => { 
        if(resp.listeners.length > 0) {
          labelElement(tabId, node.nodeId, resp.listeners[0].type );
        }
      });
    }).catch(err => {
      console.error('Could not get node listeners: ', err);
    });  
  }).catch(err => {
    console.error('Could not get node details: ', err);
  });

    /* ------ DO NOT CHANGE - START ------ */
    // const element = 'p';
    // chrome.debugger.sendCommand(
    //   { tabId: tabId },
    //   "Runtime.evaluate",
    //   { expression: `document.querySelector('${element}')` },
    //   (result) => {
    //     if (chrome.runtime.lastError) {
    //       console.error(chrome.runtime.lastError);
    //       return;
    //     }

    //     const objId = result.result.objectId; 
    //     console.log('el: ', result.result.objectId);
    //     chrome.debugger.sendCommand(
    //       { tabId: tabId },
    //       "DOMDebugger.getEventListeners",
    //       { objectId: objId },
    //       (result) => {
    //         if (chrome.runtime.lastError) {
    //           console.error(chrome.runtime.lastError);
    //           return;
    //         }
    //         console.log(result); // Event listeners for the element
    //       }
    //     );
    //   }
    // );
     /* ------ DO NOT CHANGE - END ------ */
}

async function getElements(tabId, nodeId, selector) {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand(
      { tabId: tabId },
      // "Runtime.evaluate",
      // { expression: `document.querySelectorAll('${selector}')` },
      "DOM.querySelectorAll",
      { nodeId, selector },
      (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        resolve(result);
      });
  })
}

async function getDocument(tabId) {
  return new Promise(resolve => {
    chrome.debugger.sendCommand(
      { tabId: tabId },
      "DOM.getDocument",
      {},
      (resp) => {
        resolve(resp);
      })
  });
}

async function getNodeDetails(tabId, selector) {
  try {
    // 1. Get the NodeList objectId using Runtime.evaluate
    const nodeListResult = await new Promise((resolve, reject) => {
      chrome.debugger.sendCommand(
        { tabId: tabId },
        "Runtime.evaluate",
        { expression: `document.querySelectorAll('${selector}')` },
        (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          }
          resolve(result);
        }
      );
    });

    //console.log('nodeListResult: ', nodeListResult);
    const nodeListObjectId = nodeListResult.result.objectId; // Get the objectId of the NodeList
    const nodeListIds = [];
    const nodeList = [];
    // 2. Get the nodes using DOM.querySelectorAll
    const nodesResult = await new Promise((resolve, reject) => {
      chrome.debugger.sendCommand(
        { tabId: tabId },
        "Runtime.getProperties",
        {
          objectId: nodeListObjectId, // Use the objectId of the NodeList
        },
        (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          }
          //console.log('result: ', result);
          result.result.forEach(prop => {
            if(prop.isOwn) {
              nodeListIds.push(prop.value);
            }
          });

          getDocument(tabId).then(doc => {
            getElements(tabId, doc.root.nodeId, selector).then(resp => {
              //console.log('DOM els: ', resp);
              nodeListIds.forEach((obj, index) => {
                nodeList.push({ obj, nodeId: resp.nodeIds[index]})
              })
              resolve({ nodeIds: nodeList });
            })
          })
        }
      );
    });

    //console.log('nodesResult: ', nodesResult);
    const nodeIds = nodesResult.nodeIds; // Get the nodeIds from the result
    // let objId = 0;
    // 3. Request node details for each nodeId
    const nodeDetails = await Promise.all(
      nodeIds.map((nodeId) => {
        //console.log('nodeId: ', nodeId);
        let objId = nodeId.obj.objectId;
        // console.log('objId: ', objId);
        return new Promise((resolve, reject) => {
          chrome.debugger.sendCommand(
            { tabId: tabId },
            "DOM.requestNode",
            { objectId: objId },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                //console.log("resp: ", response);
                resolve({ objectId: objId, nodeId: response.nodeId });
              }
            }
          );
        });
      })
    );

    return nodeDetails;
  } catch (error) {
    console.error("Error in getNodeDetails:", error);
    throw error;
  }
}


async function labelElement(tabId, nodeId, eventName) {
   // Add outline and label
    chrome.debugger.sendCommand(
      { tabId: tabId },
      "DOM.getOuterHTML",
      {
        nodeId: nodeId
      }, function (html) {
        // Add a label
        chrome.debugger.sendCommand(
          { tabId: tabId },
          "DOM.setOuterHTML",
          {
            nodeId: nodeId,
            outerHTML: `<div data-objectid="${nodeId}" style="outline: 2px solid blue; position: relative; display: inline-block;">
              <span style="position: absolute; top: 0; left: 0; background-color: rgba(0, 0, 255, 0.7); color: white; font-size: 1rem; padding: 2px 4px; z-index: 1000">${eventName}</span>
              ${html.outerHTML}
              </div>`,
          }
        );
      }
    );
}

function getListeners(tabId, objId) {
  return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand(
          { tabId: tabId },
          "DOMDebugger.getEventListeners",
          { objectId: objId },
          (result) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              return;
            }
            resolve(result); // Event listeners for the element
          }
        );
  });
}

chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const targetTabId = tabs[0].id;
    chrome.debugger.attach({ tabId: targetTabId }, "1.2", onAttach.bind(null, targetTabId));
  });
});
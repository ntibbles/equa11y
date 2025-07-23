function onAttach(tabId) {
    // Debugger attached successfully
    const nonInteractiveElements = ['div', 'span', 'p', 'section', 'article', 'header', 'footer'];

    getNodeDetails(tabId, nonInteractiveElements.join(','))
        .then(nodes => {
            nodes.forEach(node => {
                getListeners(tabId, node.objectId)
                    .then(resp => {
                        if (resp.listeners.length > 0) {
                            labelElement(tabId, node.nodeId, resp.listeners[0].type);
                        }
                    }).catch(err => {
                        console.error('Could not get node listeners: ', err);
                    });
                }
            )
        }).catch(err => {
            console.error('Could not get node details: ', err);
        });
}

async function getElements(tabId, nodeId, selector) {
    return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand(
            { tabId: tabId },
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
    return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand(
            { tabId: tabId },
            "DOM.getDocument",
            {},
            (resp) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(resp);
            })
    });
}

async function getNodeDetails(tabId, selector) {
    try {
        /* 
        * Get the NodeList objectId using Runtime.evaluate 
        * This returns objectId
        */
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

        const nodeListObjectId = nodeListResult.result.objectId; // Get the objectId of the NodeList
        const nodeListIds = [];
        const nodeList = [];
        /* 
        *  Get the nodes using DOM.querySelectorAll
        *  This returns objectId
        */
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

                    result.result.forEach(prop => {
                        if (prop.isOwn) {
                            nodeListIds.push(prop.value);
                        }
                    });

                    /*
                    * Grabs all the dom objects
                    * This returns nodeIds
                    */
                    getDocument(tabId).then(doc => {
                        getElements(tabId, doc.root.nodeId, selector).then(resp => {
                            nodeListIds.forEach((obj, index) => {
                                // Combine objectId and nodeId for each result
                                nodeList.push({ objectId: obj.objectId, nodeId: resp.nodeIds[index] })
                            })
                            resolve({ nodeIds: nodeList });
                        })
                    })
                }
            );
        });

        return nodesResult.nodeIds;
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
            // get the tag name from the HTML
            const regex = /<([a-zA-Z0-9]+)[^>]*>/g;
            let tag = regex.exec(html.outerHTML)[1];
            // Add a label
            chrome.debugger.sendCommand(
                { tabId: tabId },
                "DOM.setOuterHTML",
                {
                    nodeId: nodeId,
                    outerHTML: `<div data-objectid="${nodeId}" style="outline: 2px solid blue; position: relative; display: inline-block;">
                    <span style="position: absolute; top: 0; left: 0; background-color: blue; color: white; font-size: 1rem; padding: 2px 4px; z-index: 1000">${tag}: ${eventName}</span>
                    ${html.outerHTML}
                    </div>`
                }
            );
        }
    );
}

async function getListeners(tabId, objId) {
    return new Promise((resolve, reject) => {
        chrome.debugger.sendCommand(
            { tabId: tabId },
            "DOMDebugger.getEventListeners",
            { objectId: objId },
            (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(result); // Event listeners for the element
            }
        );
    });
}

async function getTabId() {
    return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if(tabs[0]) {
                resolve(tabs[0].id);
            }
        });
    })
}

async function handleMessages(message) {
    if(message.target === 'sw' && message.type === 'event-listeners') {
        if(message.isChecked) {  // FIX ME: code stink
            getTabId().then(id => {
                chrome.debugger.attach({ tabId: id }, "1.2", onAttach.bind(null, id));
            });
        } else {
            getTabId().then(id => {
                chrome.debugger.detach({ tabId: id });
            });
        }
    }
}

chrome.runtime.onMessage.addListener(handleMessages);
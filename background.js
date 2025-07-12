
// Storage helper functions for MV3 Service Worker
async function getInspectedTabs() {
  const result = await chrome.storage.session.get('inspectedTabs');
  return result.inspectedTabs || {};
}

async function setInspectedTabs(tabs) {
  await chrome.storage.session.set({ inspectedTabs: tabs });
}

async function getData(tabId) {
  const result = await chrome.storage.session.get(`data_${tabId}`);
  return result[`data_${tabId}`] || { hints: [], scopes: {} };
}

async function setData(tabId, data) {
  await chrome.storage.session.set({ [`data_${tabId}`]: data });
}

async function removeData(tabId) {
  await chrome.storage.session.remove(`data_${tabId}`);
}

async function brokerMessage(message, sender) {
  var tabId = sender.tab.id;
  const inspectedTabs = await getInspectedTabs();
  const devToolsPort = inspectedTabs[tabId];
  const tabData = await getData(tabId);

  if (!tabData.hints || !tabData.scopes || message === 'refresh') {
    await resetState(tabId);

    // TODO: this is kind of a hack-y spot to put this
    showPageAction(tabId);
  }

  if (message !== 'refresh') {
    transformMessage(tabId, message);
    await bufferData(tabId, message);
  }

  if (devToolsPort) {
    devToolsPort.postMessage(message);
  }
}

async function resetState(tabId) {
  await setData(tabId, {
    hints: [],
    scopes: {}
  });
}

function transformMessage(tabId, message) {
  var scopes = data[tabId].scopes;
  var hintables = [
    'Controllers',
    'general',
    'Modules',
    'Events'
  ];
  message.isHint = (hintables.indexOf(message.module) > -1);

  if (message.event === 'scope:destroy') {
    message.data.subTree = getSubTree(scopes, message.data.id);
  }

  if (message.event === 'model:change') {
    message.data.value = (message.data.value === undefined) ?
        undefined : JSON.parse(message.data.value);
  }
}

function getSubTree(scopes, id){
  var subTree = [id], scope;
  for (var i = 0; i < subTree.length; i++) {
    if (scope = scopes[subTree[i]]) {
      subTree.push.apply(subTree, scope.children);
    }
  }
  return subTree;
}

async function bufferData(tabId, message) {
  const tabData = await getData(tabId);
  var scope;

  if (message.isHint) {
    tabData.hints.push(message);
  }

  if (message.event === 'scope:new') {
    var childId = message.data.child;
    var parentId = message.data.parent;
    var parentScopeData = tabData.scopes[parentId];

    tabData.scopes[childId] = {
      parent: parentId,
      children: [],
      models: {}
    };

    if (parentScopeData) {
      parentScopeData.children.push(childId);
    }
  } else if (message.data.id && (scope = tabData.scopes[message.data.id])) {
    if (message.event === 'scope:destroy') {
      if (scope.parent) {
        var parentScope = tabData.scopes[scope.parent];
        parentScope.children.splice(parentScope.children.indexOf(message.data.id), 1);
      }
      for (var i = 0; i < message.data.subTree.length; i++) {
        delete tabData.scopes[message.data.subTree[i]];
      }
    } else if (message.event === 'model:change') {
      scope.models[message.data.path] = message.data.value;
    } else if (message.event === 'scope:link') {
      scope.descriptor = message.data.descriptor;
    }
  }

  // Save updated data back to storage
  await setData(tabId, tabData);

  // TODO: Handle digest timings
}

// context script –> background
chrome.runtime.onMessage.addListener(brokerMessage);

chrome.runtime.onConnect.addListener(function (devToolsPort) {
  devToolsPort.onMessage.addListener(registerInspectedTabId);

  async function registerInspectedTabId(inspectedTabId) {
    const inspectedTabs = await getInspectedTabs();
    inspectedTabs[inspectedTabId] = devToolsPort;
    await setInspectedTabs(inspectedTabs);

    let tabData = await getData(inspectedTabId);
    if (!tabData.hints || !tabData.scopes) {
      await resetState(inspectedTabId);
      tabData = await getData(inspectedTabId);
    }
    devToolsPort.postMessage({
      event: 'hydrate',
      data: tabData
    });

    devToolsPort.onDisconnect.addListener(async function () {
      const tabs = await getInspectedTabs();
      delete tabs[inspectedTabId];
      await setInspectedTabs(tabs);
    });

    //devToolsPort.onMessage.removeListener(registerInspectedTabId);
  }
});

chrome.tabs.onRemoved.addListener(async function (tabId) {
  await removeData(tabId);
});


function showPageAction(tabId) {
  chrome.action.show(tabId);
  chrome.action.setTitle({
    tabId: tabId,
    title: 'Batarang Active'
  });
}

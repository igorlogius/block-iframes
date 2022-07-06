/* global browser */

let excludeTabIdList = new Set();

const filter = { urls: ["<all_urls>"] };
const extraInfoSpec = ["blocking"];

function updateBadge(tabId, badgeText, badgeBackgroundColor,badgeTitle){
        browser.browserAction.setBadgeText({tabId, text: badgeText});
        browser.browserAction.setBadgeBackgroundColor({tabId, color: badgeBackgroundColor});
        browser.browserAction.setTitle({tabId, title: badgeTitle});
}


function onBeforeWebRequest (details) {
    if( !excludeTabIdList.has(details.tabId) && details.parentFrameId !== -1){
        return {cancel: true};
    }
}

function onTabRemoved(tabId){
    if(excludeTabIdList.has(tabId)){
        excludeTabIdList.delete(tabId);
    }
}

function onTabUpdated(tabId){
    if(excludeTabIdList.has(tabId)){
        updateBadge(tabId, 'Off', 'red', "Not Blocking iframes. Click to Enable for this Tab!");
    }else{
        updateBadge(tabId, 'On', 'green', "Blocking iframes. Click to Enable for this Tab!");
    }
}

function onBrowserActionClicked(tab) {
    const tabId = tab.id;
    if(excludeTabIdList.has(tabId)){
        excludeTabIdList.delete(tabId);
    }else{
        excludeTabIdList.add(tab.id);
    }
    onTabUpdated(tabId);
}

updateBadge(undefined, 'On', 'green', "Blocking iframes. Click to Enable for this Tab!");

browser.webRequest.onBeforeRequest.addListener(onBeforeWebRequest,filter,extraInfoSpec);
browser.browserAction.onClicked.addListener(onBrowserActionClicked);
browser.tabs.onRemoved.addListener(onTabRemoved);
browser.tabs.onUpdated.addListener(onTabUpdated, {properties: ["status"]});


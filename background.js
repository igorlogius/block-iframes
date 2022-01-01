
let active = true;

const filter = { urls: ["<all_urls>"] };
const extraInfoSpec = ["blocking"];

browser.browserAction.setBadgeText({text: (active?'on':'off') });
browser.browserAction.setBadgeBackgroundColor({color: 'green'});

function BAonClicked(tab) {
    active = !active; // toggle active state
	browser.browserAction.setBadgeText({text: (active?'on':'off') });
    browser.browserAction.setBadgeBackgroundColor({color: (active?'green':'red')});
}

function onBeforeRequest (details) {
    if( active && details.parentFrameId !== -1){
        return {cancel: true};
    }
}

browser.webRequest.onBeforeRequest.addListener(onBeforeRequest,filter,extraInfoSpec);
browser.browserAction.onClicked.addListener(BAonClicked);


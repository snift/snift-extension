// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        alert("hello");
    }
  })

  var url = 'http://localhost:9700/scores?url=';

chrome.tabs.query({active:true,currentWindow:true},function(tabs){
    //'tabs' will be an array with only one element: an Object describing the active tab
    //  in the current window.
    sendXHR(tabs[0].url)
});

function sendXHR(tablink) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        alert(xhr.responseText);
    }
}
url = url + tablink;
    xhr.open('GET', url, true);
    xhr.send(null);
}
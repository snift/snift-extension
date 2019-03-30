export const allTabs = browser.tabs.query({
  currentWindow: true
});

export const currentTab = browser.tabs.query({
  currentWindow: true,
  active: true
});

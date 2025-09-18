import { userProfile } from './profile.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_profile') {
    sendResponse({ profile: userProfile });
  }
});

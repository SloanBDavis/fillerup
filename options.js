document.addEventListener('DOMContentLoaded', function() {
  const saveButton = document.getElementById('save-button');
  const apiKeyInput = document.getElementById('api-key');
  const status = document.getElementById('status');

  // load api key
  chrome.storage.sync.get(['apiKey'], function(result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
  });

  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({apiKey: apiKey}, function() {
      status.textContent = 'API Key saved!';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const fillButton = document.getElementById('fill-button');
  const status = document.getElementById('status');

  fillButton.addEventListener('click', function() {
    status.textContent = 'Identifying fields...';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // send a message to the content script
      chrome.tabs.sendMessage(tabs[0].id, {action: "identify_fields"}, function(response) {
        if (chrome.runtime.lastError) {
          status.textContent = "Could not connect. Try reloading the page.";
          console.error(chrome.runtime.lastError.message);
          return;
        }
        if (response && response.fields) {
          status.textContent = `Found ${response.fields.length} fields.`;
          console.log("Fields received from content script:", response.fields);
        } else {
          status.textContent = "No fields found.";
        }
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const fillButton = document.getElementById('fill-button');
  const status = document.getElementById('status');

  fillButton.addEventListener('click', function() {
    status.textContent = 'Starting to fill...';
    fillButton.disabled = true;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "fill_form"}, function(response) {
        if (chrome.runtime.lastError) {
          status.textContent = "Error. Reload the page and try again.";
          console.error(chrome.runtime.lastError.message);
        } else if (response) {
          if (response.status === "complete") {
            status.textContent = `All done! Filled ${response.filled} fields.`;
          } else {
            status.textContent = `Error: ${response.message}`;
            console.error(response.message);
          }
        } else {
            status.textContent = "No response from content script.";
        }
        fillButton.disabled = false;
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const fillButton = document.getElementById('fill-button');
  const status = document.getElementById('status');

  fillButton.addEventListener('click', function() {
    status.textContent = 'Filling form...';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "fill_form"}, function(response) {
        if (chrome.runtime.lastError) {
          status.textContent = "Error. Try reloading the page.";
          console.error(chrome.runtime.lastError.message);
          return;
        }
        if (response && response.status === "complete") {
          status.textContent = `Successfully filled ${response.filled} fields.`;
        } else {
          status.textContent = "Failed to fill form.";
          console.error(response.message);
        }
      });
    });
  });
});

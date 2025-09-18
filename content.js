console.log("Content script loaded.");

function identifyFormFields() {
  const fields = [];
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    let label = '';
    const labelElement = input.closest('[data-automation-id="formField"]')?.querySelector('[data-automation-id="label"]');
    if (labelElement) {
      label = labelElement.textContent.trim();
    }

    if (label) {
      fields.push({
        label: label,
        type: input.type,
        id: input.id,
        elementSelector: `[id="${input.id}"]` 
      });
    }
  });

  console.log("Identified Fields:", fields);
  return fields;
}

// listener for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "identify_fields") {
    const identifiedFields = identifyFormFields();
    sendResponse({fields: identifiedFields});
  }
});

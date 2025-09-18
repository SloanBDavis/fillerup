console.log("Content script loaded.");

// map a field label to a profile key
function getProfileKeyForLabel(label) {
  const l = label.toLowerCase();
  if (l.includes('first name')) return 'firstName';
  if (l.includes('last name')) return 'lastName';
  if (l.includes('email')) return 'email';
  if (l.includes('phone')) return 'phone';
  if (l.includes('address')) return 'address';
  if (l.includes('linkedin')) return 'linkedin';
  if (l.includes('website') || l.includes('portfolio')) return 'website';
  return null;
}

// fill the form fields
function fillFormFields(fields, profile) {
  let filledCount = 0;
  fields.forEach(field => {
    const profileKey = getProfileKeyForLabel(field.label);
    if (profileKey && profile[profileKey]) {
      const inputElement = document.querySelector(field.elementSelector);
      if (inputElement) {
        inputElement.value = profile[profileKey];
        // let the web page's framework know there was a change
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        filledCount++;
      }
    }
  });
  return filledCount;
}

function identifyFormFields() {
  const fields = [];
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    let label = '';
    const labelElement = input.closest('[data-automation-id="formField"]')?.querySelector('[data-automation-id="label"]');
    if (labelElement) {
      label = labelElement.textContent.trim();
    }

    if (!label) {
        const parent = input.parentElement;
        const labelNode = parent.querySelector('label');
        if(labelNode) {
            label = labelNode.textContent.trim();
        }
    }
    
    if (!label && input.id) {
        const labelFor = document.querySelector(`label[for="${input.id}"]`);
        if(labelFor) {
            label = labelFor.textContent.trim();
        }
    }


    if (label && input.id) {
      fields.push({
        label: label,
        type: input.type,
        id: input.id,
        elementSelector: `#${input.id}`
      });
    }
  });

  console.log("Identified Fields:", fields);
  return fields;
}

// listener for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fill_form") {
    console.log("Received request to fill form.");
    const fields = identifyFormFields();
    
    chrome.runtime.sendMessage({action: "get_profile"}, (response) => {
      if (response && response.profile) {
        const filledCount = fillFormFields(fields, response.profile);
        sendResponse({status: "complete", filled: filledCount});
      } else {
        sendResponse({status: "error", message: "Could not retrieve profile."});
      }
    });

    return true; 
  }
});
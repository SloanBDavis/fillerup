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

function setInputValue(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

// --- Form Processing Functions ---
function identifyFormFields() {
    const fields = [];
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        let label = '';
        const labelElement = input.closest('[data-automation-id="formField"]')?.querySelector('[data-automation-id="label"]');
        if (labelElement) {
            label = labelElement.textContent.trim();
        }
        if (!label && input.id) {
            const labelFor = document.querySelector(`label[for="${input.id}"]`);
            if (labelFor) label = labelFor.textContent.trim();
        }
        if (label && input.id) {
            fields.push({ label, type: input.type, id: input.id, elementSelector: `#${input.id}` });
        }
    });
    return fields;
}

function fillFromProfile(fields, profile) {
    const unfilledFields = [];
    fields.forEach(field => {
        const profileKey = getProfileKeyForLabel(field.label);
        if (profileKey && profile[profileKey]) {
            setInputValue(field.elementSelector, profile[profileKey]);
        } else {
            // save for llm
            if(field.type === 'text' || field.type === 'textarea') {
                unfilledFields.push(field);
            }
        }
    });
    return unfilledFields;
}

function fillFromLLM(answers, allFields) {
    if (!answers) return;
    allFields.forEach(field => {
        if (answers[field.label]) {
            setInputValue(field.elementSelector, answers[field.label]);
        }
    });
}

// main listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fill_form") {
        const allFields = identifyFormFields();

        chrome.runtime.sendMessage({ action: "get_profile" }, (profileResponse) => {
            if (!profileResponse || !profileResponse.profile) {
                sendResponse({ status: "error", message: "Could not retrieve profile." });
                return;
            }

            const unfilledFields = fillFromProfile(allFields, profileResponse.profile);
            const questions = unfilledFields.map(f => f.label);

            if (questions.length > 0) {
                chrome.runtime.sendMessage({ action: "llm_fill_fields", questions }, (llmResponse) => {
                    if (llmResponse.error) {
                        sendResponse({ status: "error", message: llmResponse.error });
                        return;
                    }
                    fillFromLLM(llmResponse.answers, allFields);
                    sendResponse({ status: "complete", filled: allFields.length });
                });
            } else {
                sendResponse({ status: "complete", filled: allFields.length - unfilledFields.length });
            }
        });

        return true; // for async sendResponse
    }
});
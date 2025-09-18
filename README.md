# FillerUp

A Chrome extension to automate filling out Workday job applications.

## Overview

Tired of manually filling out the same information over and over on Workday job applications? This open-source Chrome extension automates the process by intelligently filling in your information. For the tricky, non-standard questions, it leverages the power of generative AI models through OpenRouter to generate context-aware answers.

## Features

*   **Automatic Form Filling:** Automatically fills in standard fields on Workday applications based on your saved profile.
*   **AI-Powered Responses:** Uses an LLM of your choice via OpenRouter to answer free-response questions and select appropriate yes/no options.
*   **User-Provided API Key:** You provide your own OpenRouter API key, giving you control over your data and model usage.
*   **UI Interaction:** Intelligently interacts with web page elements like checkboxes and dropdowns.
*   **Open Source:** The entire project is open source and available for community contributions.

## How It Works

1.  **Initial Autofill:** The extension first scans the Workday application and fills in all the standard fields it can recognize (e.g., name, address, work experience).
2.  **LLM-Powered Completion:** For any remaining fields, such as free-text questions ("Why are you a good fit for this role?") or complex checkbox sections, the extension sends the question and page context to an LLM via the OpenRouter API.
3.  **Response Generation:** The LLM generates a suitable response.
4.  **Final Touches:** The extension uses the generated response to fill in the remaining forms and select the correct options on the page.

## Getting Started

> **Note:** This extension is not yet published on the Chrome Web Store. You will need to load it manually.

1.  Clone this repository:
    ```bash
    git clone https://github.com/SloanBDavis/fillerup.git
    ```
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" in the top right corner.
4.  Click "Load unpacked" and select the `fillerup` directory.

## Configuration

To use the AI-powered features, you need to add your OpenRouter API key:

1.  Click on the FillerUp extension icon in your Chrome toolbar.
2.  Go to the "Settings" or "Options" page.
3.  Enter your OpenRouter API key in the designated field.

## Contributing

Contributions are welcome! If you have ideas for new features, bug fixes, or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
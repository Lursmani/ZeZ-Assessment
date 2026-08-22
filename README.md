# ZeZ Assessment

An accessible multi-step form for applying for health insurance. The user enters their personal details, selects one basic insurance plan, and can choose multiple additional insurance options. The total monthly premium is shown before submission.

## Installation

Requirements:

- Node.js 22.12 or later
- npm

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Then open the URL shown by Vite in the terminal, which is `http://localhost:5173` by default.

No environment variables or external services are required. The insurance options are loaded from `src/data/insuranceData.json`, and Vite provides a local mock endpoint for submitting applications.

## Available scripts

```bash
npm run dev       # start the development server
npm run build     # type-check and create a production build
npm run preview   # preview the production build locally
npm test          # run the test suite once
npm run lint      # check the code with ESLint
npm run prettier  # format the code
```

## Architecture decisions

- **React and TypeScript** form the foundation of the application. Form-related code is grouped in `src/features/insurance-form`, while reusable form fields are located in `src/components/form`.
- **React Hook Form** manages the form state. Fields remain registered while the user navigates between steps, preserving entered values throughout the session.
- A versioned draft containing the form values and current step is stored in **`sessionStorage`**. Incomplete applications survive a reload, while closing the tab removes the personal data. The draft is cleared after a successful submission.
- **Zod** contains the central validation rules. Each step validates only its own fields before allowing the user to continue.
- **SWR** loads the insurance options once at the application level and manages loading and error states. For this assignment, the source data is stored locally in `src/data/insuranceData.json`.
- **React Aria Components** is used for accessible interactions, including the date picker. Focus styles, error messages, and progress labels provide additional accessibility support.
- **Tailwind CSS** handles the styling. Reusable colors and dimensions are defined as theme values.
- The final form values are converted into the required payload containing complete insurance objects. During development and preview, a small Vite plugin handles `POST /api/insurance-applications` as a mock backend.
- **Vitest and Testing Library** test validation, navigation, payload creation, submission, and the main user flow.

## Trade-offs

The assignment is implemented entirely on the client side. The mock API is therefore suitable for demonstration purposes, but applications are not stored. Keeping the insurance data in a local JSON file makes the implementation simple and reproducible; in a production environment, this data would be retrieved from a real API.

Form values and the active step are restored after a reload. `sessionStorage` was chosen instead of `localStorage` because the form contains personal information; drafts therefore do not survive after the tab is closed.

## With more time

- Add a real backend with server-side validation, authentication, and persistent storage.
- Add more integration and end-to-end tests, including error scenarios and keyboard navigation.
- Make the insurance data and API URL configurable for each environment.
- Add internationalization and more extensive monitoring.

This is the frontend of a MERN stack project built using React and Vite. The project includes components for rendering charts with Chart.js, data fetching via Axios, and communication with the backend through an Express server.

Features:-
  - Chart.js Integration: Displays interactive charts using data fetched from the backend.
  - Axios for API Calls: Makes HTTP requests to the backend to retrieve or send data.
  - CORS Handling: Configures CORS to allow cross-origin requests from the frontend to the backend.
  - dotenv: Uses environment variables for configuration.
  - React + Vite: The project is created with React and Vite for fast development and optimized production builds.

Installation:-

Prerequisites:-
    Node.js (v16 or higher) installed.
    npm or yarn as your package manager.

Steps to Set Up:-

  Clone the repository to your local machine
  ```bash
  git clone https://github.com/TheBinaryCoder0/TRANSACTION_SALES_PROJECT.git
  ```

Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
Install the dependencies:
    ```bash
    npm install
    ```
Create a .env file in the root of the frontend directory to store environment variables, such as API URLs:
    ```bash
    VITE_API_URL=http://localhost:5000
    ```
Run the development server:
    ```bash
    npm run dev
    ```
  Your frontend should now be running at http://localhost:5137 (CHANGE ACCORDINGLY)

Dependencies:-

The following dependencies are used in the frontend:

  - axios: For making HTTP requests.
  - chart.js: For rendering charts.
  - chartjs-plugin-datalabels: For displaying data labels on charts.
  - cors: Middleware for enabling CORS on the backend.
  - dotenv: For managing environment variables.
  - http-proxy-middleware: For setting up proxying requests in development.
  - react: The React library.
  - react-chartjs-2: React wrapper for Chart.js.
  - react-dom: The React DOM package.

Development:-
    For development, you can modify components inside the src folder.
    Vite provides fast hot-reloading for an efficient development experience.

Run the project

To start the development server and view the application:
    ```bash
    npm run dev
    ```
This will start the Vite development server, and you can view your application at http://localhost:3000.
Building for Production

To build the frontend for production:
    ```bash
    npm run build
    ```
This will create an optimized production build in the dist folder.

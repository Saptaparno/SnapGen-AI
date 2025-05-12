SnapGen AI is a React-based application that leverages OpenAI's GPT models to generate captivating social media captions and corresponding images based on user-provided prompts. 
The application features a modern UI with support for dark/light modes, maintains a history of generated posts, and offers functionalities to download or share the generated content.

Features:

1. Generate AI-driven captions and images from custom prompts.

2. Toggle between dark and light themes for optimal viewing.

3. Download your generated content seamlessly.

4. Responsive design ensuring usability across devices.
   
Built With:

React - Frontend library

Material-UI (MUI) - UI components

Framer Motion - Animations

OpenAI API - AI content generation

Express - Backend server

Prerequisites
Node.js (v14 or above)

npm or yarn

Clone the Repository
bash
Copy
Edit
git clone https://github.com/yourusername/snapgen-ai.git
cd snapgen-ai

Also, you have to get your own api key for openai endpoint.
Update the server.js script with your api key.

# For frontend
cd frontend
npm install
npm run dev
The application will be accessible at http://localhost:3000.


# Start the backend server
cd backend
npm install
node server.js

The application will be accessible at http://localhost:5001

Make sure the backend is up and running before the frontend. 

Navigate to http://localhost:3000.

Enter your idea or prompt in the text field.

Click on the "Generate" button.

View the AI-generated caption and image.

Download or share your generated content as desired.


Contributing:

Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch: git checkout -b feature/your-feature-name.

Commit your changes: git commit -m 'Add some feature'.

Push to the branch: git push origin feature/your-feature-name.

Open a pull request.

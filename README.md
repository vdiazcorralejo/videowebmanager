# Chente Content Manager

A React-based web application for managing video content with cloud storage integration.

## Features

- Upload video files to cloud storage
- List and manage uploaded videos
- Download stored videos
- Drag and drop file upload support
- Real-time upload status notifications
- Responsive design with modern UI

## Technology Stack

- React 19.0.0
- React Icons 5.5.0
- AWS S3 for storage
- API Gateway for backend communication

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm or yarn
- A valid authentication token for API access

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd my-video-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

## API Configuration

The application requires a valid authentication token for API access. Configure your token in the `FileManager.js` component:

```javascript
const authToken = "your-valid-token";
```

## Available Scripts

- `npm start` - Runs the development server
- `npm test` - Launches the test runner
- `npm run build` - Creates a production build
- `npm run eject` - Ejects from create-react-app

## Project Structure

```
my-video-web/
├── public/
│   ├── images/
│   │   └── video-background.jpg
│   └── index.html
├── src/
│   ├── styles/
│   │   ├── App.css
│   │   └── FileManager.css
│   ├── App.js
│   ├── FileManager.js
│   └── index.js
└── package.json
```

## License

This project is private and proprietary.

## Support

For support and questions, please contact the development team.

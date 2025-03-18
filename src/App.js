import FileManager from "./FileManager";
import "./styles/App.css";

function App() {
    const backgroundImage = '/images/video-background.jpg';

    return (
        <div 
            className="app-container" 
            style={{ 
                backgroundImage: `linear-gradient(
                    rgba(26, 26, 46, 0.9), 
                    rgba(22, 33, 62, 0.95)
                ), url(${process.env.PUBLIC_URL + backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
            }}
        >
            <h1 className="app-title">Chente Content Manager</h1>
            <FileManager />
        </div>
    );
}

export default App;

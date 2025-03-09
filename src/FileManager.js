import { useState, useEffect } from "react";
import { FaUpload, FaDownload, FaVideo, FaCloudUploadAlt } from "react-icons/fa";
import "./styles/FileManager.css";

function FileManager() {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");

    // Agrega aquí tu token (en un caso real, obténlo dinámicamente)
    const authToken = "valid-token";

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        console.log('Obteniendo lista de archivos...');
        setMessage("Obteniendo lista de archivos...");
        try {
            const response = await fetch("https://k4sszix063.execute-api.eu-west-1.amazonaws.com/prod/geturl?action=list", {
                headers: { 
                    'Authorization': authToken,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Respuesta del servidor:', {
                status: data.statusCode,
                headers: data.headers,
                body: data.body
            });

            // Parse the stringified body
            const bodyData = JSON.parse(data.body);
            
            console.log('Lista de archivos:', bodyData.files);
            setFiles(bodyData.files || []);
            setMessage("Lista de archivos actualizada");
        } catch (error) {
            console.error('Error al obtener la lista de archivos:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            setMessage("Error al obtener la lista de archivos.");
        }
    };

    const getFileContentType = (file) => {
        return file.type || 'application/octet-stream';
    };

    const uploadFile = async () => {
        if (!file) {
            setMessage("No hay archivo seleccionado.");
            return;
        }

        setMessage("Obteniendo URL de subida...");

        try {
            // Primer fetch - obtener URL firmada
            console.log('Solicitando URL de subida para:', file.name);
            const response = await fetch(
                `https://k4sszix063.execute-api.eu-west-1.amazonaws.com/prod/geturl?action=get_upload_url&key=${encodeURIComponent(file.name)}`,
                { 
                    headers: { 
                        'Authorization': authToken,
                        'Accept': 'application/json'
                    }
                }
            ).catch(error => {
                console.error('Error de red al obtener URL:', error);
                throw new Error(`Error de conexión: ${error.message}`);
            });
            
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Error al obtener URL:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorBody
                });
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            // Parse the stringified body
            const bodyData = JSON.parse(data.body);
            
            console.log('Respuesta parseada:', {
                status: data.statusCode,
                headers: data.headers,
                url: bodyData.url.substring(0, 100) + '...' // Truncate URL for readability
            });

            if (!bodyData.url) {
                throw new Error('URL de subida no encontrada en la respuesta');
            }

            // Segundo fetch - subir archivo
            const contentType = getFileContentType(file);
            setMessage("Subiendo archivo a S3...");
            
            console.log('Iniciando subida a S3:', {
                url: bodyData.url.substring(0, 100) + '...',
                contentType: contentType,
                fileSize: file.size
            });

            const uploadResponse = await fetch(bodyData.url, {
                method: "PUT",
                body: file,
                headers: { 
                    "Content-Type": contentType,
                    "Content-Length": file.size.toString()
                }
            }).catch(error => {
                console.error('Error detallado de subida:', {
                    message: error.message,
                    type: error.type,
                    url: bodyData.url.substring(0, 100) + '...'
                });
                throw new Error(`Error de conexión en subida: ${error.message}`);
            });

            if (!uploadResponse.ok) {
                const errorBody = await uploadResponse.text().catch(() => 'No error body available');
                console.error('Error en respuesta de S3:', {
                    status: uploadResponse.status,
                    statusText: uploadResponse.statusText,
                    headers: Object.fromEntries(uploadResponse.headers.entries()),
                    body: errorBody
                });
                throw new Error(`Error al subir archivo: ${uploadResponse.status} ${uploadResponse.statusText}`);
            }

            console.log('Subida exitosa:', {
                status: uploadResponse.status,
                headers: Object.fromEntries(uploadResponse.headers.entries())
            });

            setMessage("¡Archivo subido con éxito!");
            fetchFiles();

        } catch (error) {
            console.error('Error detallado:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            setMessage(`Error: ${error.message}`);
        }
    };

    const downloadFile = async (fileName) => {
        console.log('Solicitando URL de descarga para:', fileName);
        setMessage("Obteniendo URL de descarga...");

        try {
            const response = await fetch(
                `https://k4sszix063.execute-api.eu-west-1.amazonaws.com/prod/geturl?action=get_download_url&key=${encodeURIComponent(fileName)}`,
                { 
                    headers: { 
                        'Authorization': authToken,
                        'Accept': 'application/json'
                    }
                }
            ).catch(error => {
                console.error('Error de red al obtener URL de descarga:', error);
                throw new Error(`Error de conexión: ${error.message}`);
            });
            
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Error al obtener URL de descarga:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorBody
                });
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Respuesta del servidor:', {
                status: data.statusCode,
                headers: data.headers,
                body: data.body
            });

            // Parse the stringified body
            const bodyData = JSON.parse(data.body);
            
            console.log('URL de descarga obtenida:', {
                fileName: fileName,
                url: bodyData.url.substring(0, 100) + '...' // Truncate URL for readability
            });

            if (!bodyData.url) {
                throw new Error('URL de descarga no encontrada en la respuesta');
            }

            setMessage("Iniciando descarga...");
            window.location.href = bodyData.url;
            
        } catch (error) {
            console.error('Error detallado de descarga:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            setMessage(`Error de descarga: ${error.message}`);
        }
    };

    return (
        <div className="file-manager-container">
            <div className="header">
                <h2>Video Content Manager</h2>
                <p>Upload, manage and share your video content</p>
            </div>

            <div className="upload-section">
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="file-input"
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="file-input-label">
                        <FaCloudUploadAlt size={40} color="#4facfe" />
                        <div style={{ marginLeft: "1rem" }}>
                            {file ? file.name : "Drag and drop your video or click to browse"}
                        </div>
                    </label>
                </div>
                <button 
                    onClick={uploadFile} 
                    disabled={!file}
                    className="upload-button"
                >
                    <FaUpload style={{ marginRight: "8px" }} /> Upload Video
                </button>
            </div>

            <div className="files-grid">
                {files.length === 0 ? (
                    <div style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                        <p>No videos available</p>
                    </div>
                ) : (
                    files.map((file, index) => (
                        <div key={index} className="file-card">
                            <div className="file-thumbnail">
                                <FaVideo size={40} color="#4facfe" />
                            </div>
                            <h4>{file}</h4>
                            <button 
                                onClick={() => downloadFile(file)} 
                                className="download-button"
                            >
                                <FaDownload style={{ marginRight: "8px" }} /> Download
                            </button>
                        </div>
                    ))
                )}
            </div>

            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default FileManager;

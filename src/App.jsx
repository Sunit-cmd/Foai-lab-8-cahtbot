import { useState } from 'react';
import './App.css';

function App() {
  const [view, setView] = useState("home"); // "home" | "image" | "text"
  const [prompt, setPrompt] = useState("");
  const token = import.meta.env.VITE_HF_TOKEN;
  const [image, setImage] = useState(null);
  const [textResult, setTextResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to generate image. Please try again later.";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.estimated_time) {
              errorMessage += ` (Estimated time: ${Math.round(errorData.estimated_time)}s)`;
            }
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateText = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setTextResult("");

    try {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ 
            model: "Qwen/Qwen3-4B-Instruct-2507:nscale",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 400
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to generate text. Please try again later.";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.estimated_time) {
              errorMessage += ` (Estimated time: ${Math.round(errorData.estimated_time)}s)`;
            }
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setTextResult(data.choices[0].message.content || "No response generated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (view === "image") handleGenerateImage();
    else handleGenerateText();
  };

  const navigateHome = () => {
    setView("home");
    setPrompt("");
    setImage(null);
    setTextResult("");
    setError(null);
  };

  if (view === "home") {
    return (
      <div className="app-container">
        <div className="card" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div className="header">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>AI Studio</h1>
            <p>Select a powerful AI capability to get started.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', marginTop: '1rem' }}>
            <button 
              className="btn" 
              onClick={() => setView('image')} 
              style={{ padding: '1.5rem', fontSize: '1.1rem' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Text-to-Image Generator
            </button>

            <button 
              className="btn" 
              onClick={() => setView('text')} 
              style={{ padding: '1.5rem', fontSize: '1.1rem', background: 'var(--primary)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Text-to-Text Generator (Qwen)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="card">
        <button 
          onClick={navigateHome}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-muted)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: 0, fontWeight: 600, fontSize: '0.9rem', alignSelf: 'flex-start'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>

        <div className="header" style={{ marginTop: '0.5rem' }}>
          <h1>{view === 'image' ? 'ImageFlow AI' : 'TextGen AI'}</h1>
          <p>{view === 'image' ? 'Generate stunning images from text' : 'Ask questions or explore ideas with Qwen'}</p>
        </div>

        <div className="input-group">
          <label htmlFor="prompt">Prompt</label>
          <textarea
            id="prompt"
            placeholder={view === 'image' 
              ? "Describe what you want to see... e.g. 'A futuristic city at sunset'"
              : "Ask a question or explain what you want to learn..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {error && (
          <div className="error-msg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        <button 
          className="btn" 
          onClick={handleGenerate} 
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <div className="loader"></div>
              Generating...
            </>
          ) : (
            <>
              {view === 'image' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              )}
              {view === 'image' ? 'Generate Image' : 'Generate Text'}
            </>
          )}
        </button>

        {view === 'image' ? (
          <div className={`image-container ${image ? 'has-image' : ''}`}>
            {loading && !image && (
              <div className="placeholder">
                <div className="pulse-circle"></div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>Generating masterpiece</span>
                  <div className="streaming-text">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            
            {!loading && !image && (
               <div className="placeholder">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                   <circle cx="8.5" cy="8.5" r="1.5"></circle>
                   <polyline points="21 15 16 10 5 21"></polyline>
                 </svg>
                 <span>Preview will appear here</span>
               </div>
            )}

            {image && (
              <img src={image} alt="Generated UI visual output" />
            )}
          </div>
        ) : (
          <div className={`text-result-container ${textResult ? 'has-text' : ''}`}>
            {loading && !textResult && (
              <div className="placeholder" style={{ margin: 'auto' }}>
                <div className="pulse-circle"></div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>Reasoning and typing</span>
                  <div className="streaming-text">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            
            {!loading && !textResult && (
               <div className="placeholder" style={{ margin: 'auto' }}>
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                 </svg>
                 <span>AI response will appear here</span>
               </div>
            )}

            {textResult && (
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {textResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

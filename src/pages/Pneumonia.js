import React, { useState } from 'react';

const Pneumonia = () => {
  const [showInlineEmbed, setShowInlineEmbed] = useState(false);
  const streamlitUrl = 'https://pneumonia-19.streamlit.app/';

  return (
    <div className="container py-4">
      <h1 className="mb-3">🩺 Pneumonia-Detection AI</h1>
      <p className="text-muted">
        The screening tool is hosted externally and may block embedding, which can cause redirect errors. Use the button below to open it in a new tab.
      </p>

      <div className="mb-4">
        <a
          href={streamlitUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="btn btn-primary"
        >
          Open Pneumonia Screening
        </a>
      </div>

      <details className="mb-3" onToggle={(e) => setShowInlineEmbed(e.target.open)}>
        <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
          Try inline embed (may not work on some hosts)
        </summary>
        {showInlineEmbed && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '75%',
              height: 0,
              overflow: 'hidden',
              borderRadius: 8,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginTop: 12,
            }}
          >
            <iframe
              title="Pneumonia-Detection AI"
              src={streamlitUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: '0',
              }}
              sandbox="allow-scripts allow-forms allow-same-origin allow-downloads"
            />
          </div>
        )}
      </details>

      <div
        className="alert alert-info"
        role="alert"
        style={{
          maxWidth: '700px',
          margin: '20px auto',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '0.95rem',
          lineHeight: '1.5',
        }}
      >
        ⚠️ If the inline view shows an error like "redirected too many times" or stays blank, the external app's security policy is preventing embedding. Opening it in a new tab will work.
      </div>
    </div>
  );
};

export default Pneumonia;
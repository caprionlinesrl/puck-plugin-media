function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getExtensionColor(ext) {
  const colors = {
    pdf: '#e74c3c',
    doc: '#2b579a',
    docx: '#2b579a',
    xls: '#217346',
    xlsx: '#217346',
    ppt: '#d24726',
    pptx: '#d24726',
    txt: '#6c757d',
  };
  return colors[ext?.toLowerCase()] || '#6c757d';
}

export function DownloadCard({ document, title, description, buttonText }) {
  const containerStyle = {
    padding: '2rem',
  };

  const cardStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const iconStyle = {
    width: '48px',
    height: '48px',
    backgroundColor: document ? getExtensionColor(document.extension) : '#6c757d',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  };

  const headerInfoStyle = {
    flex: 1,
  };

  const filenameStyle = {
    fontWeight: '600',
    color: '#333',
    marginBottom: '0.25rem',
  };

  const metaStyle = {
    fontSize: '0.875rem',
    color: '#6c757d',
  };

  const bodyStyle = {
    padding: '1.5rem',
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    color: '#333',
  };

  const descriptionStyle = {
    color: '#6c757d',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  };

  if (!document) {
    return (
      <div style={containerStyle}>
        <div style={emptyStyle}>
          <p>Select a document to make downloadable</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconStyle}>{document.extension?.toUpperCase() || '?'}</div>
          <div style={headerInfoStyle}>
            <div style={filenameStyle}>{document.filename}</div>
            <div style={metaStyle}>
              {formatFileSize(document.size)}
              {document.extension && ` - ${document.extension.toUpperCase()}`}
            </div>
          </div>
        </div>
        <div style={bodyStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {description && <p style={descriptionStyle}>{description}</p>}
          <a
            href={document.url}
            download={document.filename}
            style={buttonStyle}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}

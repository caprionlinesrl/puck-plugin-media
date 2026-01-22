export function PhotoGallery({ gallery, title, columns, gap }) {
  const containerStyle = {
    padding: '3rem 2rem',
    backgroundColor: '#f8f9fa',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const imageContainerStyle = {
    position: 'relative',
    paddingBottom: '75%', // 4:3 aspect ratio
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: '#e9ecef',
  };

  const imageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#6c757d',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
  };

  const images = gallery?.images || [];

  return (
    <div style={containerStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      {images.length > 0 ? (
        <div style={gridStyle}>
          {images.map((image, index) => (
            <div key={image.id || index} style={imageContainerStyle}>
              <img
                src={image.thumbnailUrl || image.url}
                alt={image.alt?.en || image.alt?.it || `Image ${index + 1}`}
                style={imageStyle}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStyle}>
          <p>Select a gallery to display images</p>
        </div>
      )}
    </div>
  );
}

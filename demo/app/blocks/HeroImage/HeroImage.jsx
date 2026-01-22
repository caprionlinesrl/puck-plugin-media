export function HeroImage({ backgroundImage, title, subtitle, overlayOpacity, minHeight }) {
  const containerStyle = {
    position: 'relative',
    minHeight: `${minHeight}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
  };

  const imageStyle = backgroundImage?.url
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }
    : {};

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    color: 'white',
    padding: '2rem',
    maxWidth: '800px',
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  };

  const subtitleStyle = {
    fontSize: '1.25rem',
    opacity: 0.9,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  };

  const placeholderStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '1rem',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      {backgroundImage?.url ? (
        <img
          src={backgroundImage.url}
          alt={backgroundImage.alt?.en || backgroundImage.alt?.it || ''}
          style={imageStyle}
        />
      ) : (
        <div style={placeholderStyle}>Select a background image</div>
      )}
      <div style={overlayStyle} />
      <div style={contentStyle}>
        {title && <h1 style={titleStyle}>{title}</h1>}
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      </div>
    </div>
  );
}

const Loader = ({ fullScreen = false }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loader" />
    </div>
  );
};

export default Loader;

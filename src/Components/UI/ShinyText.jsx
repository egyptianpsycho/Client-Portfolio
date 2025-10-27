import '../Services/Services.css';
const ShinyText = ({ disabled = false, speed = 5,children}) => {
  const animationDuration = `${speed}s`;

  return (
    <div className={`shiny-text ${disabled ? 'disabled' : ''}`} style={{ animationDuration }}>
      {children}
    </div>
  );
};

export default ShinyText;

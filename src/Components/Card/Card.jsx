import "./Card.css"

function Card({ Icon, title, description, linkText, bgClass }) {
  return (
    <div className="card">
      <div className={`feature-icon-contain ${bgClass}`}>
        <Icon className="feature-icon" />
      </div>

      <div className="feature-details">
        <h3>{title}</h3>
        <p>{description}</p>
        <span>{linkText}</span>
      </div>
    </div>
  );
}

export default Card;

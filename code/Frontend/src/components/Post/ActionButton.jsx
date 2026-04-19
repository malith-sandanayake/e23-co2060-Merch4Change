const ActionButton = ({ icon, count, onClick, active, activeIcon }) => (
  <div className="post-icons">
    <button onClick={onClick}>
      <img 
        src={active && activeIcon ? activeIcon : icon} 
        alt="icon" 
        className="post-svgs" 
      />
    </button>
    {count !== undefined && <p className="count">{count}</p>}
  </div>
);

export default ActionButton;
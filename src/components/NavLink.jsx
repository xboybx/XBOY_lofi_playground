import React from "react";

const NavLink = React.memo(({ name, icon, link, onClick }) => {
  const handleClick = (e) => {
    if (link) {
      window.open(link, '_blank');
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <li
      className="relative px-2 py-1 cursor-pointer group list-none flex items-center justify-center"
      onClick={handleClick}
      title={name}
    >
      {icon ? (
        <img src={icon} alt={name} className="icon-hover cursor-pointer w-4 h-4" />
      ) : (
        <span className="text-sm font-medium text-black/90 hover:opacity-70 transition-opacity">{name}</span>
      )}
    </li>
  );
});

NavLink.displayName = "NavLink";

export default NavLink;
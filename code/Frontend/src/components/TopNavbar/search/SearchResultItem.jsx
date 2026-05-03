import React from "react";

function highlightMatch(text = "", q = "") {
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\\]\]/g, "\\$&");
  const re = new RegExp(escaped, "i");
  const match = text.match(re);
  if (!match) return text;
  const start = match.index;
  const end = start + match[0].length;
  return (
    <>
      {text.slice(0, start)}
      <strong style={{ color: "#4A24E1", fontWeight: 600 }}>{text.slice(start, end)}</strong>
      {text.slice(end)}
    </>
  );
}

export default function SearchResultItem({ item, category, query }) {
  const config = {
    users: { bg: "#4A24E1", pillBg: "#EDE9FD", pillColor: "#4A24E1", label: "USERS" },
    charities: { bg: "#0D6B5E", pillBg: "#E1F5EE", pillColor: "#0D6B5E", label: "CHARITIES" },
    projects: { bg: "#D4820A", pillBg: "#FEF3DC", pillColor: "#D4820A", label: "PROJECTS" },
    products: { bg: "#6B6560", pillBg: "#F0EBE1", pillColor: "#6B6560", label: "PRODUCTS" },
    pages: { bg: "#E2DAD0", pillBg: "#E2DAD0", pillColor: "#1A1A1A", label: "PAGES" },
  };

  const c = config[category] || config.pages;

  let primary = "";
  let secondary = "";
  if (category === "users") {
    primary = item.userName;
    secondary = item.email ? `${item.email} • ${item.role}` : `${item.role}`;
  } else if (category === "charities") {
    primary = item.name;
    secondary = `${item.userName ? `@${item.userName} • ` : ""}LKR ${item.totalRaised || 0}`;
  } else if (category === "projects") {
    primary = item.name;
    secondary = `${item.charityName} • ${item.progress || 0}%`;
  } else if (category === "products") {
    primary = item.name;
    secondary = `LKR ${item.price} • ${item.vendor || ""}`;
  } else if (category === "pages") {
    primary = item.title;
    secondary = item.desc || "";
  }

  return (
    <div className="m4c-result-item" role="option">
      <div className="m4c-avatar" style={{ background: c.bg }}>
        {primary?.[0]?.toUpperCase() || "?"}
      </div>
      <div style={{ flex: 1 }}>
        <div className="m4c-primary">{highlightMatch(primary, query)}</div>
        {secondary && <div className="m4c-secondary">{secondary}</div>}
      </div>
      <div className="m4c-pill" style={{ background: c.pillBg, color: c.pillColor }}>{c.label}</div>
    </div>
  );
}

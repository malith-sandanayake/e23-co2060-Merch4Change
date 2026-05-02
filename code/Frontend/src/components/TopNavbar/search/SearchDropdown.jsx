import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchResultItem from "./SearchResultItem";
import "./Search.css";

const PAGES = [
  { title: "Donate", path: "/donations", desc: "Make a donation" },
  { title: "Login", path: "/login", desc: "Sign in to your account" },
  { title: "Register", path: "/signup/usersignup", desc: "Create an account" },
  { title: "My Orders", path: "/orders", desc: "Your purchases" },
];

export default function SearchDropdown({ query, results, open, onClose }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [flatList, setFlatList] = useState([]);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    const list = [];
    if (results) {
      if (results.users && results.users.length) list.push(...results.users.map((i) => ({ category: "users", item: i })));
      if (results.charities && results.charities.length) list.push(...results.charities.map((i) => ({ category: "charities", item: i })));
      if (results.projects && results.projects.length) list.push(...results.projects.map((i) => ({ category: "projects", item: i })));
      if (results.products && results.products.length) list.push(...results.products.map((i) => ({ category: "products", item: i })));
    }
    const pageMatches = PAGES.filter(p => query && p.title.toLowerCase().includes(query.toLowerCase()));
    if (pageMatches.length) list.push(...pageMatches.map((i) => ({ category: "pages", item: i })));
    setFlatList(list);
    setHighlight(0);
  }, [results, query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, Math.max(0, flatList.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatList[highlight]) handleSelect(flatList[highlight]);
        else navigate(`/search?q=${encodeURIComponent(query)}`);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flatList, highlight, query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);

  const handleSelect = ({ category, item }) => {
    if (category === "users") navigate(`/admin/users/${item.id}`);
    else if (category === "charities") navigate(`/charities/${item.id}`);
    else if (category === "projects") navigate(`/projects/${item.id}`);
    else if (category === "products") navigate(`/products/${item.id}`);
    else if (category === "pages") navigate(item.path);
    onClose();
  };

  const anyResults = results && (results.users?.length || results.charities?.length || results.projects?.length || results.products?.length) ;

  if (!open) return null;

  return (
    <div className="m4c-search-dropdown" ref={ref} role="listbox">
      {anyResults ? (
        <>
          {results.users && results.users.length > 0 && (
            <div>
              <div className="m4c-section-header">USERS</div>
              {results.users.map((u, idx) => (
                <div key={`u-${u.id}`} className={`m4c-result-item ${flatList[highlight] && flatList[highlight].category === 'users' && flatList[highlight].item.id === u.id ? 'highlighted' : ''}`} onClick={() => handleSelect({ category: 'users', item: u })}>
                  <SearchResultItem item={u} category="users" query={query} />
                </div>
              ))}
            </div>
          )}

          {results.charities && results.charities.length > 0 && (
            <div>
              <div className="m4c-section-header">CHARITIES</div>
              {results.charities.map((c) => (
                <div key={`c-${c.id}`} onClick={() => handleSelect({ category: 'charities', item: c })} className={`m4c-result-item ${flatList[highlight] && flatList[highlight].category === 'charities' && flatList[highlight].item.id === c.id ? 'highlighted' : ''}`}>
                  <SearchResultItem item={c} category="charities" query={query} />
                </div>
              ))}
            </div>
          )}

          {results.projects && results.projects.length > 0 && (
            <div>
              <div className="m4c-section-header">PROJECTS</div>
              {results.projects.map((p) => (
                <div key={`p-${p.id}`} onClick={() => handleSelect({ category: 'projects', item: p })} className={`m4c-result-item ${flatList[highlight] && flatList[highlight].category === 'projects' && flatList[highlight].item.id === p.id ? 'highlighted' : ''}`}>
                  <SearchResultItem item={p} category="projects" query={query} />
                </div>
              ))}
            </div>
          )}

          {results.products && results.products.length > 0 && (
            <div>
              <div className="m4c-section-header">PRODUCTS</div>
              {results.products.map((pr) => (
                <div key={`pr-${pr.id}`} onClick={() => handleSelect({ category: 'products', item: pr })} className={`m4c-result-item ${flatList[highlight] && flatList[highlight].category === 'products' && flatList[highlight].item.id === pr.id ? 'highlighted' : ''}`}>
                  <SearchResultItem item={pr} category="products" query={query} />
                </div>
              ))}
            </div>
          )}

          {PAGES.filter(p => query && p.title.toLowerCase().includes(query.toLowerCase())).length > 0 && (
            <div>
              <div className="m4c-section-header">PAGES</div>
              {PAGES.filter(p => query && p.title.toLowerCase().includes(query.toLowerCase())).map((pg) => (
                <div key={`pg-${pg.path}`} onClick={() => handleSelect({ category: 'pages', item: pg })} className={`m4c-result-item ${flatList[highlight] && flatList[highlight].category === 'pages' && flatList[highlight].item.path === pg.path ? 'highlighted' : ''}`}>
                  <SearchResultItem item={{ title: pg.title, desc: pg.desc }} category="pages" query={query} />
                </div>
              ))}
            </div>
          )}

        </>
      ) : (
        <div className="m4c-no-results">
          <div className="icon">🔍</div>
          <div style={{ fontFamily: 'DM Serif Display', fontSize: 16, color: '#1A1A1A' }}>No results for "{query}"</div>
          <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#6B6560' }}>Try searching for a charity, project, or product.</div>
        </div>
      )}

      <div className="m4c-footer">Press Enter to search all results for "{query}"</div>
    </div>
  );
}

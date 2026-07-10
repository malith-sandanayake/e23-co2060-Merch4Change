import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useSearch } from "../../hooks/useSearch";
import { Search, Loader2 } from "lucide-react";
import SearchResultItem from "../../components/TopNavbar/search/SearchResultItem";
import "./SearchPage.css";

const PAGES = [
  { title: "Donate", path: "/donations", desc: "Make a donation" },
  { title: "Login", path: "/login", desc: "Sign in to your account" },
  { title: "Register", path: "/signup/usersignup", desc: "Create an account" },
  { title: "My Orders", path: "/orders", desc: "Your purchases" },
];

export default function SearchPage() {
  const { query, setQuery, results, loading } = useSearch();
  const navigate = useNavigate();

  function handleSelect({ category, item }) {
    if (category === "users") {
      if (item.userName) navigate(`/profile/${item.userName}`);
      else navigate("/profile/me");
    }
    else if (category === "charities") {
      if (item.userName) navigate(`/profile/${item.userName}`);
      else navigate("/under-construction");
    }
    else if (category === "projects") {
      if (item.charityUserName) navigate(`/profile/${item.charityUserName}/projects`);
      else navigate("/under-construction");
    }
    else if (category === "products") navigate("/marketplace");
    else if (category === "pages") navigate(item.path);
  }

  const anyResults = results && (results.users?.length || results.charities?.length || results.projects?.length || results.products?.length);
  const pageMatches = PAGES.filter(p => query && p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`luminous-app`}>
      <div className="lum-layout">
        <Sidebar setIsSidebarCollapsed={() => {}} />
        <main className="lum-main-content">
          <div className="search-page-container">
            <div className="search-page-header">
               <div className="search-page-input-wrapper">
                 <Search className="search-page-icon" size={15} color="#888" />
                 <input 
                   type="text" 
                   className="search-page-input"
                   placeholder="Search causes, charities, projects, people..."
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   autoFocus
                 />
                 {loading && <Loader2 className="search-page-spinner" size={20} color="#888" />}
               </div>
            </div>

            <div className="search-page-results-wrapper">
              {query.length >= 2 ? (
                loading && !results ? (
                  <div className="search-page-empty">
                    <div className="search-page-spinner-large"><Loader2 size={32} color="#4A24E1" /></div>
                    <p>Searching...</p>
                  </div>
                ) : anyResults || pageMatches.length > 0 ? (
                  <div className="search-page-results-list">
                    {results.users && results.users.length > 0 && (
                      <div className="search-page-section">
                        <div className="search-page-section-header">USERS</div>
                        <div className="search-page-grid">
                          {results.users.map((u) => (
                            <div key={`u-${u.id}`} className="search-page-result-card" onClick={() => handleSelect({ category: 'users', item: u })}>
                              <SearchResultItem item={u} category="users" query={query} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.charities && results.charities.length > 0 && (
                      <div className="search-page-section">
                        <div className="search-page-section-header">CHARITIES</div>
                        <div className="search-page-grid">
                          {results.charities.map((c) => (
                            <div key={`c-${c.id}`} className="search-page-result-card" onClick={() => handleSelect({ category: 'charities', item: c })}>
                              <SearchResultItem item={c} category="charities" query={query} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.projects && results.projects.length > 0 && (
                      <div className="search-page-section">
                        <div className="search-page-section-header">PROJECTS</div>
                        <div className="search-page-grid">
                          {results.projects.map((p) => (
                            <div key={`p-${p.id}`} className="search-page-result-card" onClick={() => handleSelect({ category: 'projects', item: p })}>
                              <SearchResultItem item={p} category="projects" query={query} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.products && results.products.length > 0 && (
                      <div className="search-page-section">
                        <div className="search-page-section-header">PRODUCTS</div>
                        <div className="search-page-grid">
                          {results.products.map((pr) => (
                            <div key={`pr-${pr.id}`} className="search-page-result-card" onClick={() => handleSelect({ category: 'products', item: pr })}>
                              <SearchResultItem item={pr} category="products" query={query} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pageMatches.length > 0 && (
                      <div className="search-page-section">
                        <div className="search-page-section-header">PAGES</div>
                        <div className="search-page-grid">
                          {pageMatches.map((pg) => (
                            <div key={`pg-${pg.path}`} className="search-page-result-card" onClick={() => handleSelect({ category: 'pages', item: pg })}>
                              <SearchResultItem item={{ title: pg.title, desc: pg.desc }} category="pages" query={query} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="search-page-empty">
                    <div className="search-page-empty-icon">🔍</div>
                    <h3>No results for "{query}"</h3>
                    <p>Try searching for a charity, project, or product.</p>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

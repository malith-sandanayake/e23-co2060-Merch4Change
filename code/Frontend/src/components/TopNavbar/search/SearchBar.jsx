import React, { useRef } from "react";
import { Search } from "lucide-react";
import { useSearch } from "../../../hooks/useSearch";
import SearchDropdown from "./SearchDropdown";
import "./Search.css";

export default function SearchBar() {
  const { query, setQuery, results, loading, open, setOpen } = useSearch();
  const containerRef = useRef(null);

  return (
    <div className="lum-search" style={{ position: 'relative' }} ref={containerRef}>
      <Search size={16} color="#B0A9A2" />
      <input
        type="text"
        placeholder="Search causes, charities, projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results) setOpen(true); }}
      />
      {loading && <div style={{ marginLeft: 8 }}>⏳</div>}
      <SearchDropdown query={query} results={results} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

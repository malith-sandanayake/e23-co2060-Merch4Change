import React from "react";

function DonationTable({
  donations,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  totalPages,
  total,
}) {
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const getStatusStyle = (status) => {
    const s = status.toLowerCase();
    if (s === "completed") {
      return { backgroundColor: "#E1F5EE", color: "#0D6B5E" };
    }
    return { backgroundColor: "#FEF3DC", color: "#D4820A" };
  };

  return (
    <div>
      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by charity or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md focus:outline-none transition-shadow"
          style={{
            border: "1.5px solid #E2DAD0",
            borderRadius: "10px",
            padding: "10px 16px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "#1A1A1A",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#D4820A";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,130,10,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E2DAD0";
            e.target.style.boxShadow = "none";
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="focus:outline-none transition-shadow bg-white cursor-pointer"
          style={{
            border: "1.5px solid #E2DAD0",
            borderRadius: "10px",
            padding: "10px 16px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "#1A1A1A",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#D4820A";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,130,10,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E2DAD0";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Processing">Processing</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="w-full overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2DAD0",
          borderRadius: "16px",
        }}
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr style={{ backgroundColor: "#F0EBE1" }}>
                {["Date", "Charity", "Project", "Amount", "Status"].map((col) => (
                  <th
                    key={col}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#6B6560",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "16px 24px",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, idx) => (
                <tr
                  key={donation._id || idx}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "white" : "#FAF7F2",
                    borderBottom: "1px solid #E2DAD0",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "14px",
                    color: "#1A1A1A",
                  }}
                >
                  <td style={{ padding: "14px 24px" }}>{formatDate(donation.createdAt)}</td>
                  <td style={{ padding: "14px 24px" }}>{donation.charity}</td>
                  <td style={{ padding: "14px 24px" }}>{donation.project}</td>
                  <td style={{ padding: "14px 24px" }}>{donation.amount.toLocaleString()} coins</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        ...getStatusStyle(donation.status),
                      }}
                    >
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10" style={{ color: "#6B6560" }}>
                    No donations found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          className="flex justify-between items-center"
          style={{ padding: "16px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#6B6560" }}
        >
          <span>
            Showing {donations.length} of {total} donations
          </span>
          {totalPages > 1 && (
            <div className="flex space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="hover:underline disabled:opacity-50 disabled:no-underline bg-transparent border-none cursor-pointer"
                style={{ color: "#0D6B5E" }}
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="hover:underline disabled:opacity-50 disabled:no-underline bg-transparent border-none cursor-pointer"
                style={{ color: "#0D6B5E" }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonationTable;

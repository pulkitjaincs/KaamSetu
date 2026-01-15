const Card = ({ job, isSelected, onClick }) => {
  return (
    <div
      className={`card mb-4 transition-all animate-entry stagger-${(job.id % 5) + 1} ${isSelected
        ? "shadow-md"
        : "shadow-sm hover-shadow-md"
        }`}
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        borderRadius: "16px",
        // Active: Tinted BG. Inactive: Card BG
        backgroundColor: isSelected ? "var(--primary-50)" : "var(--bg-card)",
        // Active: Bold Primary Border. Inactive: Transparent
        border: isSelected ? "2px solid var(--primary-600)" : "2px solid transparent",
        // Active: Primary Glow. Inactive: Shadow
        boxShadow: isSelected
          ? "0 0 0 4px var(--primary-100), var(--shadow-xl)"
          : "var(--shadow-sm)"
      }}
      onMouseEnter={(e) => !isSelected && (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => !isSelected && (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3">
          <img
            src={job.image}
            className="rounded-4 object-cover"
            alt={job.title}
            style={{ width: "64px", height: "64px", flexShrink: 0, background: "var(--zinc-100)" }}
          />
          <div className="flex-grow-1 min-w-0">
            <h6 className="fw-bold mb-1 text-truncate" style={{ color: "var(--text-main)" }}>
              {job.title}
            </h6>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="small fw-medium text-truncate" style={{ color: "var(--text-muted)" }}>{job.company}</span>
              <span className="small" style={{ color: "var(--text-muted)" }}>•</span>
              <span className="small fw-medium text-truncate" style={{ color: "var(--text-muted)" }}>{job.location}</span>
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <span className="badge rounded-pill fw-semibold"
                style={{
                  backgroundColor: "var(--primary-50)",
                  color: "var(--primary-700)",
                  padding: "0.5em 1em"
                }}>
                ₹{job.salary}
              </span>
              <small className="text-muted" style={{ fontSize: "0.75rem" }}>2d ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

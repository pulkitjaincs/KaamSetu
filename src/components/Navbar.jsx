import { useState, useEffect, useRef } from "react";

const Navbar = ({ name }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [theme, setTheme] = useState("system"); // system, light, dark
  const inputRef = useRef(null);

  // Theme Logic
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = theme === "dark";
      if (theme === "system") isDark = mediaQuery.matches;

      if (isDark) root.setAttribute("data-theme", "dark");
      else root.removeAttribute("data-theme");
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  // Scroll Logic
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeIcon = () => {
    if (theme === "light") return "bi-sun-fill";
    if (theme === "dark") return "bi-moon-fill";
    return "bi-circle-half";
  };

  return (
    <div className="px-4 py-3">
      <nav
        className={`navbar navbar-expand-lg rounded-pill px-5 transition-all duration-300 ${scrolled ? "glass-panel py-3" : "py-4"
          }`}
        style={{ transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="container-fluid d-flex align-items-center">
          {/* Logo - Minimal & Geometric */}
          <a className="navbar-brand fw-bolder fs-4 d-flex align-items-center gap-2 me-4" href="#">
            <div className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "32px", height: "32px", background: "var(--text-main)", color: "var(--bg-body)" }}>
              <span className="fw-bold" style={{ fontSize: "16px", letterSpacing: "-0.05em" }}>K</span>
            </div>
            <span style={{ letterSpacing: "-0.05em", color: "var(--text-main)" }}>KaamSetu</span>
          </a>

          {/* Search Bar */}
          <div
            className="d-flex align-items-center position-relative transition-all me-auto"
            style={{
              width: searchActive ? "340px" : "240px",
              transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <div
              className="d-flex align-items-center rounded-pill"
              style={{
                position: "absolute",
                width: "100%",
                height: "44px",
                overflow: "hidden",
                cursor: "text",
                backgroundColor: searchActive ? "var(--bg-card)" : "var(--bg-surface)",
                border: searchActive ? "1px solid var(--border-active)" : "1px solid var(--border-color)",
                boxShadow: searchActive ? "var(--shadow-lg)" : "none",
                transition: "all 0.2s ease"
              }}
              onClick={() => {
                setSearchActive(true);
                inputRef.current?.focus();
              }}
            >
              <i
                className={`bi bi-search fs-6`}
                style={{
                  marginLeft: "16px",
                  transition: "color 0.2s",
                  color: searchActive ? "var(--text-main)" : "var(--text-muted)"
                }}
              ></i>

              <input
                ref={inputRef}
                type="text"
                className="form-control border-0 bg-transparent shadow-none"
                placeholder="Search jobs..."
                style={{
                  opacity: 1,
                  transform: "translateX(0)",
                  fontSize: "0.9rem",
                  paddingLeft: "12px",
                  fontWeight: "500",
                  color: "var(--text-main)"
                }}
                onFocus={() => setSearchActive(true)}
                onBlur={() => setSearchActive(false)}
              />
            </div>
          </div>

          <button className="navbar-toggler border-0 shadow-none bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <i className="bi bi-list fs-3" style={{ color: "var(--text-main)" }}></i>
          </button>

          <div className="collapse navbar-collapse flex-grow-0" id="navContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2 gap-lg-4 align-items-center">
              <li className="nav-item">
                <a className="nav-link fw-medium px-2 hover-dark" href="#" style={{ color: "var(--text-muted)" }}>Find Jobs</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium px-2 hover-dark" href="#" style={{ color: "var(--text-muted)" }}>Companies</a>
              </li>

              {/* Theme Toggle */}
              <li className="nav-item">
                <button
                  onClick={toggleTheme}
                  className="btn rounded-circle d-flex align-items-center justify-content-center p-0"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-surface)",
                    color: "var(--text-main)"
                  }}
                  title={`Current theme: ${theme}`}
                >
                  <i className={`bi ${getThemeIcon()}`}></i>
                </button>
              </li>

              <li className="nav-item">
                <button className="btn rounded-pill px-4 py-2 fw-semibold shadow-sm"
                  style={{
                    background: "var(--text-main)",
                    color: "var(--bg-body)",
                    fontSize: "0.95rem",
                    border: "none"
                  }}>
                  Sign In
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;

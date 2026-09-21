import * as React from "react";
import { Link } from "gatsby";

import { Socials } from "./icons";
import { handle, name, socials } from "../data/site";

/* ------------------------------------------------------------------ */
/*  The shell every page renders inside.                               */
/*                                                                     */
/*  Three grid rows on a viewport-tall box: header, content, footer.   */
/*  Only the middle row scrolls, so the chrome stays put at every      */
/*  width without any of it being position: fixed — fixed bars have to */
/*  be paid for twice, once to lift them out of flow and again as      */
/*  padding on the content so it clears them, and the two drift apart  */
/*  the moment either height changes.                                  */
/* ------------------------------------------------------------------ */

/**
 * Both nameplate lines are drawn in one SVG so they share a coordinate
 * system: each <text> is pinned to textLength="1000", the full width of
 * the viewBox, which makes the two strings exactly as wide as each other
 * at any rendered size. lengthAdjust="spacing" spends the difference on
 * the gaps between glyphs rather than on the glyphs themselves, so the
 * letterforms are never stretched and the correction absorbs whatever
 * the system font stack resolves to on the reader's machine. The whole
 * block then scales with --nameplate-w; nothing here is viewport-bound.
 */
const Nameplate = () => (
  <Link className="nameplate" to="/" aria-label={`${handle} — ${name}`}>
    <svg
      className="nameplate-art"
      viewBox="0 0 1000 222"
      aria-hidden="true"
      focusable="false"
    >
      <text
        className="nameplate-handle"
        x="0"
        y="128"
        textLength="1000"
        lengthAdjust="spacing"
      >
        {handle}
      </text>
      <text
        className="nameplate-name"
        x="0"
        y="212"
        textLength="1000"
        lengthAdjust="spacing"
      >
        {name}
      </text>
    </svg>
  </Link>
);

// partiallyActive so a single note keeps "notes" lit, and /tech keeps "tech".
const NavLink = ({ to, children }) => (
  <Link to={to} activeClassName="is-active" partiallyActive>
    {children}
  </Link>
);

// .site-bar runs wider than the page column on purpose: the chrome spans
// the window, the reading column stays narrow underneath it.
export const Header = () => (
  <header className="site-header">
    <div className="site-bar">
      <Nameplate />
      <nav className="site-nav" aria-label="Sections">
        <NavLink to="/notes/">notes</NavLink>
        <span className="site-nav-sep" aria-hidden="true">
          |
        </span>
        <NavLink to="/tech/">tech</NavLink>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="site-bar">
      <Socials items={socials} size={14} label="Social media" />
    </div>
  </footer>
);

const Layout = ({ children, location }) => {
  const main = React.useRef(null);
  const pathname = location?.pathname;

  // The shell outlives a route change, and so does the scroll offset of
  // the element carrying it: without this, leaving /notes/ halfway down
  // lands you halfway down the next page. Keyed on the pathname rather
  // than on location, which is a new object on every render and would
  // pin the content to the top.
  React.useEffect(() => {
    if (main.current) main.current.scrollTop = 0;
  }, [pathname]);

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main" ref={main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

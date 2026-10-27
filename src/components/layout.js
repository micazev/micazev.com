import * as React from "react";
import { Link } from "gatsby";

import { handle, name, contact } from "../data/site";

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

// partiallyActive so a single project page keeps "projects" lit.
const NavLink = ({ to, children }) => (
  <Link to={to} activeClassName="is-active" partiallyActive>
    {children}
  </Link>
);

// .site-bar runs on the same column as the page under it, so the handle,
// the menu and the footer links line up with the text.
// /notes/ and /yoga/ still build; they're just not linked from the header.
export const Header = () => (
  <header className="site-header">
    <div className="site-bar">
      <Link className="site-handle" to="/" aria-label={`${handle} — ${name}`}>
        {handle}
      </Link>
      <nav className="site-nav" aria-label="Sections">
        <NavLink to="/projects/">projects</NavLink>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="site-bar">
      <ul className="site-contact" aria-label="Contact">
        <li>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
        {contact.links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
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

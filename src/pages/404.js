import * as React from "react";
import { Link } from "gatsby";

const NotFoundPage = () => (
  <main className="page">
    <header className="reveal">
      <h1 className="name">Page not found</h1>
      <p className="role">There's nothing at this address.</p>
    </header>
    <div className="actions reveal" style={{ animationDelay: "60ms" }}>
      <Link className="email-button" to="/">
        Back home
      </Link>
    </div>
  </main>
);

export default NotFoundPage;

export const Head = () => <title>Not found — Michelle Azevedo</title>;

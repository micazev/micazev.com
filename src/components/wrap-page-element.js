import * as React from "react";

import Layout from "./layout";

// Shared by gatsby-browser.js and gatsby-ssr.js so every page — including
// 404 and anything createPages adds later — is wrapped without opting in.
export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);

// Carlito, latin subset only: the nameplate is the one thing that uses it
// and it carries no accented characters. Self-hosted through Fontsource so
// the build owns the bytes and no request leaves for a font CDN.
import "@fontsource/carlito/latin-400.css";

import "./src/styles/global.css";

export { wrapPageElement } from "./src/components/wrap-page-element";

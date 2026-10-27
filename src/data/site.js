/* ------------------------------------------------------------------ */
/*  Site-wide identity and links.                                      */
/*                                                                     */
/*  The header and the footer contact row are rendered on every page   */
/*  by src/components/layout.js, so the strings behind them live here  */
/*  rather than in any one page.                                       */
/* ------------------------------------------------------------------ */

import homeContent from "../../content/site/home.json";

export const handle = "micazev";

export const name = "Michelle Azevedo";

// Edited in the CMS at /admin under "Site copy" -> "Home page".
export const contact = homeContent.contact;

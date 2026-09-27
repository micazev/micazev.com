/* ------------------------------------------------------------------ */
/*  Site-wide identity and links.                                      */
/*                                                                     */
/*  The header nameplate and the footer social row are rendered on     */
/*  every page by src/components/layout.js, so the strings behind them */
/*  live here rather than in any one page.                             */
/* ------------------------------------------------------------------ */

import siteContent from "../../content/site/site.json";

export const handle = "@micazev";

export const name = "Michelle Azevedo";

// Edited in the CMS at /admin under "Site copy" -> "Footer socials".
export const socials = siteContent.socials;

import * as React from "react";

import ShaderBackground from "../components/shader-background";

/* ------------------------------------------------------------------ */
/*  The landing page is the shell and nothing else: nameplate, menu,   */
/*  social row, and the gradient filling the space between them. The   */
/*  writing lives at /notes, the work at /tech.                        */
/* ------------------------------------------------------------------ */

const IndexPage = () => (
  <>
    <ShaderBackground />
    <h1 className="sr-only">Michelle Azevedo</h1>
  </>
);

export default IndexPage;

export const Head = () => (
  <>
    <title>Michelle Azevedo</title>
    <meta
      name="description"
      content="Michelle Azevedo — product engineer based in Ho Chi Minh City, Vietnam. Building Moradiah, a proptech for first-time homeowners."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </>
);

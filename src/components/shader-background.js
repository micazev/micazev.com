import * as React from "react";

/* ------------------------------------------------------------------ */
/*  Animated background for the home page.                             */
/*                                                                     */
/*  The two objects below are the config exported from                 */
/*  shadergradient.co — paste a new export over them to change the     */
/*  look. The editor also emits bgColor1, bgColor2, destination,       */
/*  embedMode, format, frameRate, axesHelper and gizmoHelper; those    */
/*  drive the editor's own GIF export and the component ignores them,  */
/*  so they are left out here.                                         */
/* ------------------------------------------------------------------ */

const canvas = {
  fov: 45,
  pixelDensity: 1,
};

const gradient = {
  animate: "on",
  brightness: 1.2,
  cAzimuthAngle: 180,
  cDistance: 2.9,
  cPolarAngle: 120,
  cameraZoom: 1,
  color1: "#ebedff",
  color2: "#f3f2f8",
  color3: "#dbf8ff",
  envPreset: "city",
  grain: "off",
  lightType: "3d",
  positionX: 0,
  positionY: 1.8,
  positionZ: 0,
  range: "disabled",
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.1,
  rotationX: 0,
  rotationY: 0,
  rotationZ: -90,
  shader: "defaults",
  type: "waterPlane",
  uAmplitude: 0,
  uDensity: 1,
  uFrequency: 5.5,
  uSpeed: 0.3,
  uStrength: 3,
  uTime: 0.2,
  wireframe: false,
};

/* ------------------------------------------------------------------ */

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
};

/**
 * The gradient is WebGL, so it can only exist in the browser. It is
 * imported after mount rather than at the top of the file: that keeps
 * three.js out of the SSR bundle and off the critical path, and a
 * browser that fails to load or run it simply gets the plain white
 * ground the rest of the design already assumes.
 */
const ShaderBackground = () => {
  const [shader, setShader] = React.useState(null);
  const reducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    let active = true;
    import("@shadergradient/react")
      .then((loaded) => {
        if (active) setShader(loaded);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (!shader) return null;

  const { ShaderGradientCanvas, ShaderGradient } = shader;

  return (
    <div className="shader-bg" aria-hidden="true">
      {/* lazyLoad is off on purpose. It gates the canvas behind an
          IntersectionObserver, and an observer only fires on a *change*:
          on a client-side route change back to "/" the first callback
          reports not-intersecting, and a fixed full-viewport element
          never crosses the threshold again, so the canvas would never
          mount. Nothing is lost — this element is always in view, and
          the import above already keeps three.js off the critical path. */}
      <ShaderGradientCanvas {...canvas} pointerEvents="none" lazyLoad={false}>
        <ShaderGradient
          {...gradient}
          animate={reducedMotion ? "off" : gradient.animate}
        />
      </ShaderGradientCanvas>
    </div>
  );
};

export default ShaderBackground;

/*
Production entry point. LibreTexts injects the built bundle via a <script> tag;
this file mounts the widget next to that tag and wires up the window.Sidebar()
global. The component itself lives in SidebarComponent.tsx so it can be rendered
standalone (with HMR) by the dev harness in /dev.
*/
import { createRoot } from "react-dom/client";
import SidebarComponent from "../components/SidebarComponent";

// Insert a mount point next to this script tag. document.currentScript is null
// for module/deferred scripts (e.g. the Vite dev harness), so fall back to body.
const target = document.createElement("div");
target.id = "libretexts-sidebar-root";
const host = document.currentScript;
if (host && host.parentNode) host.parentNode.insertBefore(target, host);
else document.body.appendChild(target);

// Normalize persisted settings on first load (treat missing/"null" as defaults).
if (localStorage.getItem("beeline") === null || localStorage.getItem("beeline") === "null") {
  localStorage.setItem("beeline", "off");
}
if (!localStorage.getItem("glossarizerType") || localStorage.getItem("glossarizerType") === "null") {
  localStorage.setItem("glossarizerType", "textbook");
}
if (!localStorage.getItem("annotationType") || localStorage.getItem("annotationType") === "null") {
  localStorage.setItem("annotationType", "none");
}

window.Sidebar = function () {
  if (window === window.top)
    //don't activate if in an iframe
    createRoot(target).render(<SidebarComponent />);
};

window.addEventListener("load", () => {
  if (window.Sidebar && !LibreTexts.active.sidebar) {
    LibreTexts.active.sidebar = true;
    window.Sidebar();
    // buildManager();
  }
});

import "../Sidebar.css";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { DavisProvider, Drawer, Select, Stack } from "@libretexts/davis-react";
import Contents from "./Contents";
import Readability from "./Readability";
import Resources from "./Resources";
import Tools from "./Tools";
import Developers from "./Developers";
import type { ToggleDrawer } from "./Common";

/*
This is your React Hook.
Your top-level logic should go here, but other parts should be handled by sub-components.
*/
export default function SidebarComponent() {
  const [openPanel, setOpenPanel] = useState<string | undefined>(undefined);
  const [lastPanel, setLastPanel] = useState<string | undefined>(undefined);

  useEffect(function () {
    // initialization
    const textSize = localStorage.getItem("LT_fontSize");
    const marginSize = localStorage.getItem("LT_pageWidth");
    if (textSize)
      document
        .querySelectorAll<HTMLElement>(
          "section.mt-content-container p, section.mt-content-container li",
        )
        .forEach((el) => {
          el.style.fontSize = textSize + "rem";
        });
    if (marginSize)
      document
        .querySelectorAll<HTMLElement>("section.mt-content-container")
        .forEach((el) => {
          el.style.marginLeft = marginSize + "vw";
          el.style.marginRight = marginSize + "vw";
        });
  }, []);

  const tabs = ["contents", "readability", "resources", "tools"];
  const isPro = document.getElementById("proHolder")?.innerText === "true";
  if (isPro) tabs.push("developers");

  // Curried so host code can call LibreTexts.active.sidebarToggleDrawer('contents')(event).
  // The Davis Drawer (a Headless UI Dialog) owns Escape / outside-click close itself, so
  // the old hand-rolled keydown handling is gone.
  const toggleDrawer: ToggleDrawer = (panel) => () => {
    setOpenPanel(panel || undefined);
    if (panel) setLastPanel(panel);
  };
  LibreTexts.active.sidebarToggleDrawer = toggleDrawer;

  const list = () => {
    switch (openPanel) {
      case "contents":
        return <Contents toggleDrawer={toggleDrawer} />;
      case "resources":
        return <Resources toggleDrawer={toggleDrawer} />;
      case "readability":
        return <Readability toggleDrawer={toggleDrawer} />;
      case "tools":
        return <Tools toggleDrawer={toggleDrawer} />;
      case "developers":
        return <Developers toggleDrawer={toggleDrawer} />;
      default:
        return null;
    }
  };

  return (
    <DavisProvider>
      <div id="sidebarDiv" />
      <Drawer
        open={Boolean(openPanel)}
        onClose={() => setOpenPanel(undefined)}
        side="left"
        size="lg"
        className={
          openPanel === "resources"
            ? "sidebarDrawer resourcesDrawer"
            : "sidebarDrawer"
        }
      >
        <Drawer.Header>
          <Stack
            direction="horizontal"
            align="center"
            justify="between"
            className="w-full"
          >
            <Select
              name="sidebar-panel"
              label="Panel"
              labelClassName="sr-only"
              placeholder="Select panel"
              className="flex-1 sidebarDrawerSelect"
              value={openPanel || ""}
              onChange={(event) => toggleDrawer(event.target.value)(event)}
              options={tabs.map((tab) => ({
                value: tab,
                label: tab.charAt(0).toUpperCase() + tab.slice(1),
              }))}
            />
            <Drawer.Close aria-label="Close Sidebar panel" className="mt-1 cursor-pointer!" />
          </Stack>
        </Drawer.Header>
        <Drawer.Body className="sidebarDrawerBody">{list()}</Drawer.Body>
      </Drawer>
      {createPortal(
        <>
          <div id="sbHeader" className="sbHeader">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className="top-tabs"
                title={`Open ${tab} panel`}
                onClick={toggleDrawer(tab)}
              >
                <span>{tab}</span>
              </button>
            ))}
          </div>
          {!openPanel ? (
            <button
              id="custom_open"
              type="button"
              title="Open Sidebar panel"
              onClick={toggleDrawer(lastPanel || "contents")}
            >
              ☰
            </button>
          ) : null}
        </>,
        document.body,
      )}
    </DavisProvider>
  );
}

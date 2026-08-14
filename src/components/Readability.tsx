import { useState } from "react";
import { Button, Divider, NumberInput } from "@libretexts/davis-react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { numOr } from "../util/storage";
import type { PanelProps } from "./Common";

// The host reads/writes LT_fontSize as a rem multiplier (1.0 = body size). The stepper
// speaks pixels, which users understand; we convert at the boundary. 16px = 1rem.
const PX_PER_REM = 16;
const remToPx = (rem: number) => Math.round(rem * PX_PER_REM);

export default function Readability(_props: PanelProps) {
  const [currentTheme, setTheme] = useState(localStorage.getItem("beeline"));
  const [textPx, setTextPx] = useState(remToPx(numOr(localStorage.getItem("LT_fontSize"), 1.0)));
  const [marginSize, setMarginSize] = useState(numOr(localStorage.getItem("LT_pageWidth"), 5));

  const setBeelineTheme = (inTheme: string) => () => {
    if (!inTheme) return;
    setTheme(inTheme);
    localStorage.setItem("beeline", inTheme);
    doBeeline(inTheme);
  };

  function BeelineButton(props: { theme: string; title?: string }) {
    return (
      <Button
        id={`SB_${props.theme}`}
        variant="secondary"
        onClick={setBeelineTheme(props.theme)}
        className="m-1.5 border-2 border-white"
        icon={currentTheme === props.theme ? <CheckIcon className="size-4" /> : null}
        iconPosition="right"
      >
        {props.title || props.theme}
      </Button>
    );
  }

  function rtdefault() {
    setTextPx(remToPx(1.0));
    setMarginSize(5);
    localStorage.removeItem("LT_fontSize");
    localStorage.removeItem("LT_pageWidth");
    setBeelineTheme("off")();
    location.reload();
  }

  return (
    <div className="p-3 flex flex-col gap-5">
      <NumberInput
        name="text-size"
        label="Text Size (px)"
        value={textPx}
        min={12}
        max={28}
        step={1}
        onChange={(value) => {
          setTextPx(value);
          const rem = value / PX_PER_REM;
          localStorage.setItem("LT_fontSize", String(rem));
          document
            .querySelectorAll<HTMLElement>(
              "section.mt-content-container p, section.mt-content-container li",
            )
            .forEach((el) => {
              el.style.fontSize = rem + "rem";
            });
        }}
      />
      <NumberInput
        name="margin-size"
        label="Margin Size"
        value={marginSize}
        min={0}
        max={30}
        step={5}
        onChange={(value) => {
          setMarginSize(value);
          localStorage.setItem("LT_pageWidth", String(value));
          document
            .querySelectorAll<HTMLElement>("section.mt-content-container")
            .forEach((el) => {
              el.style.marginLeft = value + "vw";
              el.style.marginRight = value + "vw";
            });
        }}
      />
      <Button variant="secondary" onClick={rtdefault}>
        Reset to Default Settings
      </Button>
      <Divider />
      <a href="http://www.beelinereader.com/education/?utm_source=libretexts">
        <img
          style={{ margin: "0 5vw" }}
          title="Beeline Logo"
          src="https://test.libretexts.org/hagnew/development/public/Binh%20Nguyen/ReactSidebar/src/assets/beeline_logo_combo_master-cropped.svg"
        />
      </a>

      <p id="beelineExample">
        {" "}
        BeeLine Reader uses subtle color gradients to help you read more quickly and efficiently.
        Choose a color scheme below, or{" "}
        <a
          style={{ color: "#30b3f6", display: "unset", margin: 0 }}
          href="http://www.beelinereader.com/education/?utm_source=libretexts"
        >
          click here to learn more.{" "}
        </a>
      </p>
      <div id="doBeeline">
        <BeelineButton theme="bright" />
        <BeelineButton theme="blues" />
        <BeelineButton theme="gray" title="grays" />
        <BeelineButton theme="night_blues" title="Inverted" />
        <BeelineButton theme="off" />
      </div>
    </div>
  );
}

function doBeeline(theme: string) {
  if (!theme) return;

  const beelineELements = document.querySelectorAll<HTMLElement>(
    ".mt-content-container p:not(.box-legend),.mt-content-container li, #beelineExample",
  );
  beelineELements.forEach((el) => {
    let beeline = el.beeline;
    if (beeline) {
      beeline.setOptions({ theme: theme });
    } else {
      beeline = new BeeLineReader(el, {
        theme: theme,
        skipBackgroundColor: true,
        handleResize: true,
        skipTags: ["svg", "h1", "h3", "h3", "h4", "h3", "style", "script", "blockquote"],
      });
      el.beeline = beeline;
    }
    if (theme === "off") {
      beeline.uncolor();
    } else {
      beeline.color();
    }
  });
  if (typeof ga === "function") {
    ga("send", "event", "BeelineColor", localStorage.getItem("beeline"));
  }
}

window.activateBeeLine = function activateBeeLine() {
  //initalization function. Called by Mathjax
  const beeline = localStorage.getItem("beeline");
  if (beeline) {
    if (beeline !== "off") doBeeline(beeline);
  } else {
    localStorage.setItem("beeline", "off");
  }
};

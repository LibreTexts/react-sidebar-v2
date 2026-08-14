import { useState } from "react";
import { Button, RadioGroup } from "@libretexts/davis-react";
import {
  IconArrowsShuffle,
  IconBookmark,
  IconCode,
  IconEye,
  IconEyeOff,
  IconLicense,
  IconQuote,
} from "@tabler/icons-react";
import { strOr } from "../util/storage";
import type { PanelProps } from "./Common";

export default function Tools(props: PanelProps) {
  const [glossarySource, setGlossarySource] = useState(
    strOr(localStorage.getItem("glossarizerType"), "textbook"),
  );

  return (
    <div>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        <li>
          <Button
            variant="primary"
            onClick={openRemixer}
            icon={<IconArrowsShuffle />}
            fullWidth
          >
            OER Remixer
          </Button>
        </li>
        <li>
          <Button
            variant="primary"
            icon={<IconQuote />}
            onClick={() => {
              buildcite();
              props.toggleDrawer(false)();
            }}
            fullWidth
          >
            Page Citation
          </Button>
        </li>
        <li>
          <Button
            variant="primary"
            icon={<IconLicense />}
            onClick={() => {
              attribution();
              props.toggleDrawer(false)();
            }}
            fullWidth
          >
            Page Attribution
          </Button>
        </li>
        <li>
          <Button
            variant="primary"
            icon={<IconCode />}
            as="a"
            href={`/Under_Construction/Sandboxes/Henry/Get_Contents?${document.getElementById("IDHolder")?.innerText}`}
            fullWidth
          >
            Get Page Source
          </Button>
        </li>
        <li>
          <AutoAttribution />
        </li>
        <li>
          <Button
            variant="primary"
            icon={<IconBookmark />}
            onClick={() => {
              saveBookmark();
            }}
            fullWidth
          >
            Bookmark Page
            {/* <div id="bm-list" /> */}
          </Button>
        </li>
      </ul>
      <br />
      <RadioGroup
        name="glossary-source"
        label="Glossary Source"
        className="p-1"
        orientation="horizontal"
        value={glossarySource}
        onChange={(value) => {
          libretextGlossary.makeGlossary(value);
          setGlossarySource(value);
        }}
        options={[
          { value: "textbook", label: "Textbook" },
          { value: "none", label: "None" },
        ]}
      />
    </div>
  );
}

async function openRemixer() {
  localStorage.setItem(
    "RemixerLastText",
    JSON.stringify({
      title: document.getElementById("titleHolder")?.innerText ?? "",
      url: window.location.href,
    }),
  );
  const coverpage = await LibreTexts.getCoverpage();
  if (coverpage) {
    const searchParams = new URLSearchParams({
      remixURL: `${window.location.protocol}//${window.location.host}/${coverpage}`,
      autoLoad: "true",
    });
    window.location.assign(
      `/Under_Construction/Development_Details/OER_Remixer?${searchParams.toString()}`,
    );
    return;
  }
  window.location.assign("/Under_Construction/Development_Details/OER_Remixer");
}

function AutoAttribution() {
  const [active, setActive] = useState(false);
  return (
    <Button
      variant="primary"
      icon={active ? <IconEye /> : <IconEyeOff />}
      id="librelens-button"
      onClick={() => {
        LibreTexts.active.libreLens?.();
        setActive(!active);
      }}
      fullWidth
    >
      Toggle AutoAttribution
      {/* <div id="librelens-list" /> */}
    </Button>
  );
}

function saveBookmark() {
  const TITLE = document.getElementById("titleHolder")?.innerText ?? "";
  const URL = window.location.href;
  const CHECK = sessionStorage.getItem("Bookmark");
  if (CHECK == null) {
    sessionStorage.setItem("Title", TITLE);
    sessionStorage.setItem("Bookmark", URL);
    createBookmarks();
  }
}

function createBookmarks() {
  const LI = document.createElement("li");
  const URL = sessionStorage.getItem("Bookmark");
  const TITLE = sessionStorage.getItem("Title");
  LI.id = "sbBookmark";
  LI.innerHTML = `<div > <p><a style="display: unset;" href="${URL}"> ${TITLE}</a><a id="removeBookmark" style="display: unset;" onclick="removeBookmarks()">| Remove</a> </p></div>`;
  if (URL) {
    document.querySelector("#bm-list")?.appendChild(LI);
  }
}

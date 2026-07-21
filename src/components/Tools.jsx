import { useState } from "react";
import { IconLink } from "./Common.jsx";
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

export default function Tools(props) {
  const [glossarySource, setGlossarySource] = useState(
    localStorage.getItem("glossarizerType"),
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
      title: document.getElementById("titleHolder").innerText,
      url: window.location.href,
    }),
  );
  const coverpage = await LibreTexts.getCoverpage();
  if (coverpage) {
    const searchParams = new URLSearchParams({
      remixURL: `${window.location.protocol}//${window.location.host}/${coverpage}`,
      autoLoad: true,
    });
    window.location.assign(
      `/Under_Construction/Development_Details/OER_Remixer?${searchParams.toString()}`,
    );
    return;
  }
  window.location.assign("/Under_Construction/Development_Details/OER_Remixer");
}

async function viewLicensingReport() {
  let coverpage = await LibreTexts.getCoverpage(window.location.href);
  let foundCLR = false;
  if (typeof coverpage !== undefined) {
    let subpages = await LibreTexts.getSubpages(
      `${window.location.protocol}//${window.location.hostname}/${coverpage}`,
    );
    if (subpages.children && Array.isArray(subpages.children)) {
      let frontMatter = subpages.children.find(
        (item) =>
          typeof item.title === "string" && item.title.includes("Front Matter"),
      );
      if (
        frontMatter !== undefined &&
        frontMatter.children &&
        Array.isArray(frontMatter.children)
      ) {
        let clr = frontMatter.children.find(
          (item) =>
            typeof item.title === "string" && item.title.includes("Licensing"),
        );
        if (clr !== undefined && clr.url !== undefined) {
          foundCLR = true;
          window.open(clr.url, "_blank", "noopener noreferrer");
        }
      }
    }
  }
  if (!foundCLR)
    alert("Sorry, a Licensing Report isn't available for this content.");
}

async function downloadLicensingReport() {
  let coverpage = await LibreTexts.getCoverpage(window.location.href);
  let foundCLR = false;
  if (typeof coverpage !== undefined) {
    let [subdomain, path] = LibreTexts.parseURL(
      `${window.location.protocol}//${window.location.hostname}/${coverpage}`,
    );
    let filesList = await LibreTexts.authenticatedFetch(
      path,
      "files?dream.out.format=json",
      subdomain,
      {
        method: "GET",
      },
    );
    if (filesList.ok) {
      let filesJSON = await filesList.json();
      if (filesJSON.file && Array.isArray(filesJSON.file)) {
        let clr = filesJSON.file.find(
          (item) =>
            typeof item.filename === "string" &&
            item.filename === "content-licensing-report.pdf",
        );
        if (clr !== undefined && clr.contents && clr.contents["@href"]) {
          foundCLR = true;
          window.open(clr.contents["@href"], "_blank", "noopener noreferrer");
        }
      }
    }
  }
  if (!foundCLR)
    alert("Sorry, a Licensing Report isn't available for this content.");
}

function AutoAttribution(props) {
  const [active, setActive] = useState(false);
  return (
    <Button
      variant="primary"
      icon={active ? <IconEye /> : <IconEyeOff />}
      id="librelens-button"
      onClick={() => {
        LibreTexts.active.libreLens();
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
  const TITLE = document.getElementById("titleHolder").innerText;
  const URL = window.location.href;
  const CHECK = sessionStorage.getItem("Bookmark");
  if (CHECK == null) {
    sessionStorage.setItem("Title", TITLE);
    sessionStorage.setItem("Bookmark", URL);
    createBookmarks();
  }
}

function createBookmarks() {
  var _a;
  const LI = document.createElement("li");
  const URL = sessionStorage.getItem("Bookmark");
  const TITLE = sessionStorage.getItem("Title");
  LI.id = "sbBookmark";
  LI.innerHTML = `<div > <p><a style="display: unset;" href="${URL}"> ${TITLE}</a><a id="removeBookmark" style="display: unset;" onclick="removeBookmarks()">| Remove</a> </p></div>`;
  if (URL) {
    (_a = document.querySelector("#bm-list")) === null || _a === void 0
      ? void 0
      : _a.appendChild(LI);
  }
}

function removeBookmarks() {
  var _a;
  (_a = document.querySelector("#bm-list")) === null || _a === void 0
    ? void 0
    : _a.removeChild(document.querySelector("#sbBookmark"));
  sessionStorage.removeItem("Title");
  sessionStorage.removeItem("Bookmark");
}

function makeNotification(statusValue) {
  const subdomain = window.location.origin.split("/")[2].split(".")[0];
  let pageType = "all";
  if (args == "0") {
    pageType = "page";
  }
  let pageID = document.getElementById("IDHolder").innerText;
  fetch(
    `https://${subdomain}.libretexts.org/@app/subscription/status.json?pageId=${pageID}&status=${statusValue}&type=${pageType}`,
    { method: "POST" },
  );
}

function makeAnnotation(inputSourceOption) {
  let sourceOption =
    inputSourceOption || localStorage.getItem("annotationType");
  switch ((sourceOption || "").trim().toLowerCase()) {
    case "none":
      document.querySelectorAll("hypothesis-sidebar").forEach((el) => {
        el.style.display = "none";
      });
      return;
    case "notebene":
      localStorage.setItem("annotationType", "notebene");
      document.querySelectorAll("hypothesis-sidebar").forEach((el) => {
        el.style.display = "none";
      });
    default:
      localStorage.setItem("annotationType", "hypothesis");
      document.querySelectorAll("hypothesis-sidebar").forEach((el) => {
        el.style.display = "";
      });
  }
}

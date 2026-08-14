import { useEffect, useRef, useState } from "react";
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
  const remixerLinkSetupHasRun = useRef<boolean>(false);
  const [glossarySource, setGlossarySource] = useState(
    strOr(localStorage.getItem("glossarizerType"), "textbook"),
  );

  const [currentSubdomain, setCurrentSubdomain] = useState<string | null>(null);
  const [currentCoverPage, setCurrentCoverPage] = useState<any>(null);
  const [projectID, setProjectID] = useState<string | null>(null);

  useEffect(() => {
    if (remixerLinkSetupHasRun.current) {
      return;
    }
  
    if (!LibreTexts) {
      console.error("[Tools]: LibreTexts global object not found.");
      return; // We won't set the ref to true here in case LibreTexts object just isn't loaded yet; we want to try again next render.
    }

    // See if the projectID is already set on the LibreTexts.current object (e.g. by libreExportButtons.js or other scripts)
    if (LibreTexts.current.projectID) {
      setProjectID(String(LibreTexts.current.projectID));
      remixerLinkSetupHasRun.current = true;
      return;
    }

    // If not, we'll try to look it up ourselves using the coverpage info. This is a fallback in case the projectID isn't set on the LibreTexts.current object.
    getBookProjectID().then((id) => {
      setProjectID(id);
      remixerLinkSetupHasRun.current = true;
    }).catch((e) => {
      console.error(`[Tools]: ${e.toString()}`);
      remixerLinkSetupHasRun.current = true; // Don't keep trying if there's an error, it's unlikely to self recover
    });

  }, [remixerLinkSetupHasRun.current]);


  const loadCoverpage = async (): Promise<boolean> => {
    const [subdomain] = LibreTexts.parseURL();
    if (!subdomain) {
      return false; // couldn't parse subdomain, can't proceed
    }

    /**
     * Try to reuse the current coverpage info if it's already set on the LibreTexts.current object
     * e.g. by libreExportButtons.js or other scripts.
     */
    if (LibreTexts.current.coverpage) {
      setCurrentSubdomain(subdomain);
      setCurrentCoverPage(LibreTexts.current.coverpage);
      return true;
    }

    const coverPath = await LibreTexts.getCoverpage();
    if (!coverPath) {
      return false; // couldn't find coverpage path, can't proceed
    }

    const coverPageInfo = await LibreTexts.getAPI(`https://${subdomain}.libretexts.org/${coverPath}`);
    if (!coverPageInfo) {
      return false;
    }

    setCurrentSubdomain(subdomain);
    setCurrentCoverPage(coverPageInfo);

    return true;
  };

  const getBookProjectID = async (): Promise<string | null> => {
    try {
      if (!currentCoverPage) {
        await loadCoverpage();
      }

      if (!currentSubdomain || !currentCoverPage || !currentCoverPage.id) {
        return null;
      }

      // Check local storage for projectID first
      const fromLocalStorage = localStorage.getItem(`projectID-${currentSubdomain}-${currentCoverPage.id}`);
      if (fromLocalStorage) {
        return fromLocalStorage;
      }

      // If not found in local storage, try to fetch from conductor
      const conductorRes = await fetch(
        `https://commons.libretexts.org/api/v1/project/find-by-book/${currentSubdomain}-${currentCoverPage.id}`,
        { headers: { 'X-Requested-With': 'XMLHttpRequest' } },
      );

      if (!conductorRes.ok) {
        console.error(`[ExportButtons]: Failed to fetch project ID from conductor. Status: ${conductorRes.status}`);
        return null;
      }

      const projectData = await conductorRes.json();
      const projectID = projectData.projectID;

      if (!projectID) {
        console.error(`[ExportButtons]: Project ID not found in conductor response.`);
        return null;
      }

      // Save projectID to local storage
      localStorage.setItem(`projectID-${currentSubdomain}-${currentCoverPage.id}`, projectID);
      return projectID;
    } catch (e: any) {
      console.error(`[ExportButtons]: ${e.toString()}`);
      return null;
    }
  };

  function openRemixer() {
    // Try to use the projectID from state, then from LibreTexts.current, then from localStorage as a fallback
    // This is a worst-case scenario fallback in case the projectID isn't set on the LibreTexts.current object and we haven't been able to fetch it yet.
    let projectIDToUse = projectID ?? LibreTexts.current.projectID ?? localStorage.getItem(`projectID-${currentSubdomain}-${currentCoverPage?.id}`);
    if (!projectIDToUse) {
      console.error("Project ID not found. Cannot open Remixer.");
      return;
    }

    const remixerURL = `https://commons.libretexts.org/project/${projectIDToUse}?source=library`;
    window.open(remixerURL, "_blank");
  }

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

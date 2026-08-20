import { TableOfContents, type PanelProps } from "./Common";
import { Accordion, Button, Text } from "@libretexts/davis-react";
import {
  IconEye,
  IconHash,
  IconMath,
  IconRestore,
} from "@tabler/icons-react";

export default function Developers(_props: PanelProps) {
  let tags = document.getElementById("pageTagsHolder")?.innerText || "";
  const allowMatter =
    tags.includes("coverpage:yes") ||
    tags.includes("coverpage:toc") ||
    tags.includes("coverpage:nocommons");

  const CONSTRUCTION_GUIDE_URL =
    "https://chem.libretexts.org/Courses/Remixer_University/Construction_Guide_for_LibreTexts_2e";

  return (
    <div>
      <Accordion variant="bordered">
        <Accordion.Item>
          <Accordion.Trigger>
            <span className="flex items-center gap-3 SidebarItem">
              <span className="mt-icon-site-tools" aria-hidden="true" />
              Construction Guide
            </span>
          </Accordion.Trigger>
          <Accordion.Panel>
            <TableOfContents coverpageURL={CONSTRUCTION_GUIDE_URL} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <ul className="flex flex-col gap-2 list-none p-0 mt-6">
        <li>
          <Button
            variant="primary"
            icon={<IconEye />}
            onClick={() => {
              document.querySelectorAll<HTMLElement>("dd").forEach((el) => {
                el.style.display = "";
              });
            }}
            fullWidth
          >
            Reveal Answers
          </Button>
        </li>
        <li>
          <Button
            variant="primary"
            icon={<IconRestore />}
            onClick={() => {
              LibreTexts.authenticatedFetch(null, "unorder", null, {
                method: "PUT",
              });
              window.location.reload();
            }}
            fullWidth
          >
            Reset Page Order
          </Button>
        </li>
        <li>
          <Button
            variant="primary"
            icon={<IconHash />}
            onClick={() => {
              LibreTexts.getSubpages().then((data) => {
                const idMatches = JSON.stringify(data).match(/"id":"\d+"/g);
                let ids: string[];
                if (idMatches) {
                  ids = idMatches
                    .map((e) => e.match(/"id":"(\d+)"/)?.[1])
                    .filter((id): id is string => id != null);
                } else {
                  const holderId = document.getElementById("IDHolder")?.innerText;
                  ids = holderId ? [holderId] : [];
                }
                const [subdomain = ""] = LibreTexts.parseURL();
                const prefixed = ids.map((e) => subdomain + "-" + e);
                navigator.clipboard.writeText(prefixed.join(", "));
                console.log(prefixed.join(", "));
                alert("Copied pageIDs to the clipboard");
              });
            }}
            fullWidth
          >
            Copy PageIDs
          </Button>
        </li>
        <li>
          <Button
            variant="primary"
            as="a"
            icon={<IconMath />}
            href="https://chem.libretexts.org/Under_Construction/Development_Details/Misc_Pages/Realtime_MathJax"
            fullWidth
          >
            RealTime MathJax
          </Button>
        </li>
        {allowMatter ? (
          <li>
            <Text>
              Matter generation has moved to the Remixer. Please visit the Remixer to generate front/back matter.
            </Text>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

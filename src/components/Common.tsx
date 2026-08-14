import { useEffect } from "react";
import type { ReactNode } from "react";
import Hashes from "jshashes";
import { Accordion, Button, type ButtonProps } from "@libretexts/davis-react";

/** Drawer toggle threaded from SidebarComponent down into every panel. */
export type ToggleDrawer = (panel?: string | false) => (event?: unknown) => void;
export interface PanelProps {
  toggleDrawer: ToggleDrawer;
}

type ButtonVariant = NonNullable<ButtonProps["variant"]>;

interface IconLinkProps {
  title: string;
  href?: string;
  icon?: string | ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  children?: ReactNode;
}

/*
A single sidebar row: an icon slot plus a label. Renders as an anchor when `href` is
given (external navigation) and as a button otherwise (an action handler). Davis's Button
is polymorphic via `as`, so both share one styled row. `icon` may be a host font-icon
class string (wrapped in a span) or a React element (e.g. a Tabler icon), passed through
as-is. `variant` defaults to the low-key "ghost"; pass "primary" for emphasized rows.
*/
export function IconLink(props: IconLinkProps) {
  const variant: ButtonVariant = props.variant || "ghost";
  const icon =
    typeof props.icon === "string" ? (
      <span className={props.icon} aria-hidden="true" />
    ) : (
      props.icon
    );
  const shared = {
    variant,
    fullWidth: true,
    className: `${variant === "ghost" ? "SidebarItem " : ""}justify-start gap-3`,
    icon,
    iconPosition: "left" as const,
    onClick: props.onClick,
    children: props.title,
  };

  return (
    <>
      {props.href ? (
        <Button as="a" href={props.href} rel="external nofollow" target="_blank" {...shared} />
      ) : (
        <Button as="button" type="button" {...shared} />
      )}
      {props.children}
    </>
  );
}

interface LibraryItemProps {
  subdomain: string;
  text: string;
}

export function LibraryItem(props: LibraryItemProps) {
  let URLname;
  if (props.subdomain === "espanol" || props.subdomain === "query") {
    URLname = `https://${props.subdomain}.libretexts.org/home`;
  } else {
    URLname = `https://${props.subdomain}.libretexts.org/Bookshelves/`;
  }
  return (
    <Accordion variant="bordered">
      <Accordion.Item>
        <Accordion.Trigger>
          <span className="flex items-center gap-3 SidebarItem">
            <img
              className="icon"
              alt=""
              style={{ height: 25, width: 25, objectFit: "contain" }}
              src={`https://libretexts.org/img/LibreTexts/glyphs_blue/${props.subdomain}.png`}
            />
            {props.text}
          </span>
        </Accordion.Trigger>
        <Accordion.Panel>
          <TableOfContents coverpageURL={URLname} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

interface TableOfContentsProps {
  coverpageURL: string;
}

export function TableOfContents(props: TableOfContentsProps) {
  //create hash to use as the id
  let hash = new Hashes.SHA256().hex(props.coverpageURL);

  useEffect(() => {
    LibreTexts.TOC(props.coverpageURL, `#${hash}`);
  }, [props.coverpageURL]);

  return <div id={hash} />;
}

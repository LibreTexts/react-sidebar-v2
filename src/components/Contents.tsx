import { TableOfContents, type PanelProps } from "./Common";

export default function Contents(_props: PanelProps) {
  return (
    <div className="p-2">
      <TableOfContents coverpageURL={""} />
    </div>
  );
}

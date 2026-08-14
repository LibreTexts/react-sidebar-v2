import { LibraryItem } from "./Common";

export default function Libraries() {
  return (
    <div>
      <LibraryItem key="bio" text="Biology" subdomain="bio" />
      <LibraryItem key="biz" text="Business" subdomain="biz" />
      <LibraryItem key="chem" text="Chemistry" subdomain="chem" />
      <LibraryItem key="eng" text="Engineering" subdomain="eng" />
      <LibraryItem key="espanol" text="Espanol" subdomain="espanol" />
      <LibraryItem key="geo" text="Geosciences" subdomain="geo" />
      <LibraryItem key="human" text="Humanities" subdomain="human" />
      <LibraryItem key="k12" text="K12 Education" subdomain="k12" />
      <LibraryItem key="math" text="Mathematics" subdomain="math" />
      <LibraryItem key="med" text="Medicine" subdomain="med" />
      <LibraryItem key="phys" text="Physics" subdomain="phys" />
      <LibraryItem key="socialsci" text="Social Sciences" subdomain="socialsci" />
      <LibraryItem key="stats" text="Statistics" subdomain="stats" />
      <LibraryItem key="workforce" text="Workforce" subdomain="workforce" />
    </div>
  );
}

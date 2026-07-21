import {Accordion} from "@libretexts/davis-react";
import {TableOfContents} from "./Common.jsx";
import IframeResizer from "iframe-resizer-react";

export default function Resources(props) {
    let [subdomain] = LibreTexts.parseURL();
    switch (subdomain) {
        case "bio":
            return (
                <Accordion variant="bordered">
                    <Accordion.Item defaultOpen>
                        <Accordion.Trigger>Reference Tables</Accordion.Trigger>
                        <Accordion.Panel>
                            <TableOfContents coverpageURL="https://bio.libretexts.org/Learning_Objects/Reference"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Trigger>Physical Constants</Accordion.Trigger>
                        <Accordion.Panel>
                            <iframe
                                src="https://bio.libretexts.org/Learning_Objects/Reference/Physical_Constants_and_Conversion_of_Units?adaptView"
                                loading="lazy"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            );
        case "chem":
            return (
                <Accordion variant="bordered">
                    <Accordion.Item defaultOpen>
                        <Accordion.Trigger>Periodic Table</Accordion.Trigger>
                        <Accordion.Panel>
                            <IframeResizer
                                src="https://pubchem.ncbi.nlm.nih.gov/periodic-table/#view=table&embed=true&hide_all_headings=true"
                                loading="lazy"
                                alt="The Periodic Table of the Elements showing all elements with their chemical symbols, atomic weight, and atomic number."/>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Trigger>Reference Tables</Accordion.Trigger>
                        <Accordion.Panel>
                            <TableOfContents
                                coverpageURL="https://chem.libretexts.org/Bookshelves/Ancillary_Materials/Reference"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Trigger>Physical Constants</Accordion.Trigger>
                        <Accordion.Panel>
                            <iframe
                                src="https://chem.libretexts.org/Bookshelves/Ancillary_Materials/Reference/Units_and_Conversions/Physical_Constants?adaptView"
                                loading="lazy"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Trigger>Scientific Calculator</Accordion.Trigger>
                        <Accordion.Panel>
                            <iframe src="https://www.desmos.com/scientific" loading="lazy"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            );
        case 'stats':
            return (
                <Accordion variant="bordered">
                    <Accordion.Item defaultOpen>
                        <Accordion.Trigger>Interactive Calculators</Accordion.Trigger>
                        <Accordion.Panel>
                            <iframe
                                src="https://stats.libretexts.org/Learning_Objects/02%3A_Interactive_Statistics/46%3A__Links_to_the_Calculators?adaptView"
                                loading="lazy"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            );
        default:
            return (
                <Accordion variant="bordered">
                    <Accordion.Item defaultOpen>
                        <Accordion.Trigger>Physical Constants</Accordion.Trigger>
                        <Accordion.Panel>
                            <iframe
                                src="https://chem.libretexts.org/Bookshelves/Ancillary_Materials/Reference/Units_and_Conversions/Physical_Constants?adaptView"
                                loading="lazy"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item>
                        <Accordion.Trigger>Scientific Calculator</Accordion.Trigger>
                        <Accordion.Panel>
                            <iframe src="https://www.desmos.com/scientific" loading="lazy"/>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            );
    }
}

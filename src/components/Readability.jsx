import {useState} from 'react';
import PropTypes from "prop-types";
import {Button, Divider, NumberInput} from "@libretexts/davis-react";
import {CheckIcon} from '@heroicons/react/24/solid';

const num = (raw, fallback) => (raw === null || raw === "" || Number.isNaN(Number(raw)) ? fallback : Number(raw));

// The host reads/writes LT_fontSize as a rem multiplier (1.0 = body size). The stepper
// speaks pixels, which users understand; we convert at the boundary. 16px = 1rem.
const PX_PER_REM = 16;
const remToPx = (rem) => Math.round(rem * PX_PER_REM);

export default function Readability(props) {
    const [currentTheme, setTheme] = useState(localStorage.getItem("beeline"));
    const [textPx, setTextPx] = useState(remToPx(num(localStorage.getItem("LT_fontSize"), 1.0)));
    const [marginSize, setMarginSize] = useState(num(localStorage.getItem("LT_pageWidth"), 5));

    const setBeelineTheme = (inTheme) => () => {
        if (!inTheme)
            return;
        setTheme(inTheme);
        localStorage.setItem('beeline', inTheme);
        doBeeline(inTheme);
    }

    function BeelineButton(props) {
        return <Button id={`SB_${props.theme}`} variant="secondary" onClick={setBeelineTheme(props.theme)}
                       className="m-1.5 border-2 border-white"
                       icon={currentTheme === props.theme ? <CheckIcon className="size-4"/> : null}
                       iconPosition="right">
            {props.title || props.theme}
        </Button>
    }

    BeelineButton.propTypes = {theme: PropTypes.string}

    function rtdefault() {
        setTextPx(remToPx(1.0));
        setMarginSize(5);
        localStorage.removeItem('LT_fontSize');
        localStorage.removeItem('LT_pageWidth');
        setBeelineTheme('off')()
        location.reload();
    }

    return (
        <div className="p-3 flex flex-col gap-5">
            <NumberInput name="text-size" label="Text Size (px)"
                         value={textPx} min={12} max={28} step={1}
                         onChange={(value) => {
                             setTextPx(value);
                             const rem = value / PX_PER_REM;
                             localStorage.setItem('LT_fontSize', rem);
                             document.querySelectorAll('section.mt-content-container p, section.mt-content-container li')
                                 .forEach((el) => { el.style.fontSize = rem + "rem"; });
                         }}/>
            <NumberInput name="margin-size" label="Margin Size"
                         value={marginSize} min={0} max={30} step={5}
                         onChange={(value) => {
                             setMarginSize(value);
                             localStorage.setItem('LT_pageWidth', value);
                             document.querySelectorAll('section.mt-content-container')
                                 .forEach((el) => {
                                     el.style.marginLeft = value + "vw";
                                     el.style.marginRight = value + "vw";
                                 });
                         }}/>
            <Button variant="secondary" onClick={rtdefault}>Reset to Default Settings</Button>
            <Divider/>
            <a href="http://www.beelinereader.com/education/?utm_source=libretexts">
                <img style={{margin: "0 5vw"}} title="Beeline Logo"
                     src="https://test.libretexts.org/hagnew/development/public/Binh%20Nguyen/ReactSidebar/src/assets/beeline_logo_combo_master-cropped.svg"/>
            </a>

            <p id="beelineExample"> BeeLine Reader uses subtle color gradients to help you read more quickly and
                                    efficiently. Choose a
                                    color scheme below, or <a style={{color: '#30b3f6', display: 'unset', margin: 0}}
                                                              href="http://www.beelinereader.com/education/?utm_source=libretexts">
                    click here to learn more. </a>
            </p>
            <div id="doBeeline">
                <BeelineButton theme="bright"/>
                <BeelineButton theme="blues"/>
                <BeelineButton theme="gray" title="grays"/>
                <BeelineButton theme="night_blues" title="Inverted"/>
                <BeelineButton theme="off"/>
            </div>
        </div>
    );
}

function doBeeline(theme) {
    if (!theme)
        return;

    const beelineELements = document.querySelectorAll(".mt-content-container p:not(.box-legend),.mt-content-container li, #beelineExample");
    for (let i = 0; i < beelineELements.length; i++) {
        let beeline = beelineELements[i].beeline;
        if (beeline) {
            beeline.setOptions({theme: theme});
        }
        else {
            beeline = new BeeLineReader(beelineELements[i], {
                theme: theme,
                skipBackgroundColor: true,
                handleResize: true,
                skipTags: ['svg', 'h1', 'h3', 'h3', 'h4', 'h3', 'style', 'script', 'blockquote']
            });
            beelineELements[i].beeline = beeline;
        }
        if (theme === "off") {
            beeline.uncolor();
        }
        else {
            beeline.color();
        }
    }
    if (typeof ga === 'function') {
        ga('send', 'event', 'BeelineColor', localStorage.getItem("beeline"));
    }
}

window.activateBeeLine = function activateBeeLine() { //initalization function. Called by Mathjax
    if (localStorage.getItem("beeline")) {
        if (localStorage.getItem("beeline") !== "off")
            doBeeline(localStorage.getItem("beeline"), localStorage.getItem("beeline"));
    }
    else {
        localStorage.setItem('beeline', 'off');
    }
}

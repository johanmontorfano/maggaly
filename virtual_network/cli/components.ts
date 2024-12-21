import { ButtonPopup, SimplifiedStyledElement } from "console-gui-tools";

export const TAB = "        ";

export function ErrorPopup(message: string) {
    new ButtonPopup({
        id: "error_popup",
        title: "Error",
        buttons: ["OK"],
        message: `  ${message}  `
    }).show();
}

export function InfoPopup(message: string) {
    new ButtonPopup({
        id: "info_popup",
        title: "Info",
        buttons: ["OK"],
        message: `  ${message}  `
    }).show();
}

export function Shortcut(text: string): SimplifiedStyledElement {
    return { text, color: "gray", italic: true };
}

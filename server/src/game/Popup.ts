import { NetPopup } from "common/NetPopup";
import { Server } from "socket.io";
import { Emitter } from "./GameAPI";

export class Popup {
    title: string
    subtitle: string | null;
    timeout: number;

    constructor(title: string, subtitle?: string, timeout?: number) {
        this.title = title;
        this.subtitle = subtitle? subtitle : null;
        this.timeout = timeout? timeout : 5000;
    }

    netify(): NetPopup {
        return {
            title: this.title,
            subtitle: this.subtitle,
            timeout: this.timeout
        };
    };

    emit(emitter: Emitter) {
        emitter("popup", this.netify());
    }


}
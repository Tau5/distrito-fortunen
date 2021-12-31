import { ActionList } from "common/ActionList";
import { Player } from "./Player";

export class ActionListHandler {

    actionList: ActionList;
    player:     Player;

    constructor(player: Player) {
        this.actionList = []
        this.player = player;
    }

    private handleTrigger(callback: Function, args: any) {
        this.unbind();
        callback(args)
    }

    addAction(name: string, callback: Function) {
        this.actionList.push({name: name, numberInput: null});
        this.player.socket.once(name, args => this.handleTrigger(callback, args));
    }

    addActionWithNumberInput(name: string, max: number, min: number, placeholder: number, callback: (output: number) => void) {
        this.actionList.push({
            name: name, 
            numberInput: {max: max, min: min, placeholder: placeholder}
        });
        this.player.socket.once(name, args => this.handleTrigger(callback, args));
    }

    emit() {
        this.player.socket.emit("display action list", this.actionList);
    }

    unbind() {
        this.actionList.forEach(action => {
            this.player.socket.removeAllListeners(action.name);
        })
    }

}
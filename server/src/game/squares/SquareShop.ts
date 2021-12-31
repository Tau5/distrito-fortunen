import { Point } from "common/Point";
import { Square } from "../Square";
import { SquareDescription } from "common/SquareDescription";
import { ActionListHandler } from "../ActionListHandler";
import { Player } from "../Player";
import { resolve } from "path/posix";
import { Popup } from "../Popup";
import { Server } from "socket.io";
import { GameAPI } from "../GameAPI";

export class SquareShop extends Square {
    value: number;
    price: number;
    max_capital: number;
    rank: number;
    owner: number | null;

    constructor(location: Point, name: string, value: number, price: number, rank: number, neighbours: Point[]) {
        let description: SquareDescription = {
            baseText: "",
            rank: rank, // FIXME: Sistema de rango; El rango puede cambiar
            title: name,
            values: []
        }
        super(location, description, neighbours);
        
        this.value = value;
        this.price = price;
        this.rank = rank;
        this.owner = null;
        this.max_capital = this.value * 2;
        this.description.values = [
            {label: "Value", value: this.value},
            {label: "Price", value: this.price}
        ];
    }

    onDrop(player: Player, api: GameAPI) {
        return new Promise<void>((resolve, reject) => {
            if (!this.owner) { // La propiedad no tiene propietario :)
                let buyAction: ActionListHandler = new ActionListHandler(player);
                buyAction.addAction("Buy", () => {
                    if (player.getReadyCash() < this.value) {
                        let popup = new Popup("You don't have enough money");
                        popup.emit(player.socket.emit);
                        resolve();
                    }
                    player.setReadyCash(player.getReadyCash() - this.value);
                    this.owner = player.turnNumber;
                    this.description.baseText = `Property of ${player.name}`;
                    this.description.values.push(
                        {label: "Max. capital", value: this.max_capital}
                    );
                    this.update(this);
                    let popup = new Popup(`${player.name} has bought ${this.description.title}!`);
                    popup.emit(api.emitter);
                    resolve();
                })
                buyAction.addAction("Don't buy", () => {
                    resolve();
                })
                buyAction.emit();
            } else {
                if (player.turnNumber == this.owner) {
                    let valueAction: ActionListHandler = new ActionListHandler(player);
                    valueAction.addAction("Increase price", () => {
                        //TODO:
                    })
                } else {
                    if (player.getReadyCash() - this.price < 0) {
                        // TODO: You are in trouble kiddo
                    } else {
                        player.setReadyCash( player.getReadyCash() - this.price )
                        let owner = api.getPlayerByTurnNumber(this.owner);
                        if (owner) {
                            owner.setReadyCash(owner.getReadyCash()+this.price);
                        }
                    }
                }
                resolve();
            }
        })
    }

    onStep(player: Player) {
        return new Promise<void>((resolve, reject) => {
            resolve()
        })
    }
}
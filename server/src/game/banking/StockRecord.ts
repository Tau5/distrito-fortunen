import { Player } from "../Player";

export class StockRecord {
    player: Player;
    stocks: number;

    constructor(player: Player) {
        this.player = player;
        this.stocks = 0;
    }

    addStocks(quantity: number, cost: number) {
        this.stocks += quantity;
        this.player.changeReadyCash(-cost);
    }
}
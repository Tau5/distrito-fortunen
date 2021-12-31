import { District } from "../District";
import { Player } from "../Player";
import { StockRecord } from "./StockRecord";

export class Bank {
    volatility: number;

    constructor() {
        this.volatility = 65536;
    }

    getStockCost(district: District): number {
        return Math.trunc((district.getTotalShopValue() / district.getShopCount()) / 65536 * this.volatility);
    }

    getStocksCost(district: District, quantity: number): number {
        return this.getStockCost(district) * quantity;
    }

    buyStocks(district: District, quantity: number, record: StockRecord) {
        record.addStocks(quantity, this.getStocksCost(district, quantity));
        if (quantity > 10) {
            this.volatility *= 1.07;
        }
    }

    initializeDistrict(district: District, players: Array<Player>) {
        players.forEach(player => {
            district.addRecord(new StockRecord(player));
        });
    }
}
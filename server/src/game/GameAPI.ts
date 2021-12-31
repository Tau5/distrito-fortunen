import { Player } from "./Player";

export type Emitter = (ev: string, ...args: any[]) => void;

export interface GameAPI {
    emitter: Emitter;
    getPlayerByTurnNumber: (turnNumber: number) => (Player | undefined);
}
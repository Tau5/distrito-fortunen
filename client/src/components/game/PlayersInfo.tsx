import { GameSituation } from 'common/GameSituation';
import * as React from 'react';
import { Colors } from "common/Colors";
import { NetPlayer } from 'common/NetPlayer';

interface PlayersInfoProps {
    gameSituation: GameSituation;
}
 
class PlayersInfo extends React.Component<PlayersInfoProps> {

    getPlayerFillStyle(turnNumber: number) {
        switch (turnNumber) {
            case 0:
                return Colors.blue;
            case 1:
                return Colors.orange;
            case 2:
                return Colors.red;
            case 3:
                return Colors.violet;
            default:
                return "black"
                break;
        }
    }

    render() { 
        return ( 
            <div>
                {this.props.gameSituation.players.map((player: NetPlayer) => {
                    let bgStyleColor = {
                        backgroundColor: this.getPlayerFillStyle(player.turnNumber)
                    };
                    return (
                        <div className="player-info">
                            <p className="player-info-name" style={bgStyleColor} >{player.name}</p>
                            <p className="player-info-readyCash" >{player.readyCash} 💶</p>
                            <p className="player-info-netWorth" >{player.netWorth} 🏦</p>
                        </div>
                    )
                })}
            </div>
        );
    }
}
 
export default PlayersInfo;
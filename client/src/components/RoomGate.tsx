import * as React from 'react';
import { Component } from 'react';
import {io, Socket} from "socket.io-client";
import WaitingRoom from "./WaitingRoom";

interface RoomGateProps {
    socket: Socket
}
 
interface RoomGateState {
    joinRoomSelected: boolean,
    joinedRoom: boolean,
    errors: string
    roomID: string
}
 
class RoomGate extends React.Component<RoomGateProps, RoomGateState> {
    constructor(props: RoomGateProps) {
        super(props);
        this.state = {
            joinRoomSelected: false,
            joinedRoom: false,
            errors: "",
            roomID: ""
        };
        this.createRoom = this.createRoom.bind(this);
        this.joinRoom = this.joinRoom.bind(this)
        this.handleRoomIDChange = this.handleRoomIDChange.bind(this)
        this.switchToJoinRoom = this.switchToJoinRoom.bind(this)
    }

    createRoom() {
        this.props.socket.emit("create room", (roomID: string) => {
            this.setState({roomID: roomID});
            this.joinRoom();
        })
        
    }

    joinRoom() {
        this.props.socket.emit("join room", this.state.roomID, (response: string) => {
            if (response != "success") {
                this.setState({errors: response});
            } else {
                this.setState({joinedRoom: true})
            }
        })
    }

    handleRoomIDChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            roomID: event.target.value,
        })
    }
    
    switchToJoinRoom() {
        this.setState({joinRoomSelected: true});
    }

    render() {
        if (!this.state.joinedRoom) {
            if (this.state.joinRoomSelected) {
                return ( 
                    <div>
                        <p className="error" >{this.state.errors}</p>
                        <input type="text" size={10} placeholder="Room ID" value={this.state.roomID} onChange={this.handleRoomIDChange} />
                        <button onClick={this.joinRoom}>Join</button>
                    </div> 
                );
            } else {
                return(
                    <div>
                        <p className="error" >{this.state.errors}</p>
                        <button onClick={this.createRoom} >Create Room</button>
                        <button onClick={this.switchToJoinRoom} >Join Room</button>
                    </div>
                )
            }
        } else {
            return ( <WaitingRoom socket={this.props.socket} roomId={this.state.roomID} /> );
        }
    }
}
 
export default RoomGate;
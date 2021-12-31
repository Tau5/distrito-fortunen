import * as React from 'react';
import { Action } from "common/ActionList";

interface ActionButtonProps {
    reply: (name: string, number: number | null) => void;
    action: Action;
}
 
interface ActionButtonState {
    value: number | null;
}
 
class ActionButton extends React.Component<ActionButtonProps, ActionButtonState> {
    constructor(props: ActionButtonProps) {
        super(props);
        this.state = { value: null }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        if (this.props.action.numberInput) {
            this.setState(
                {value: this.props.action.numberInput.placeholder}
            )
        }
    }
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!this.props.action.numberInput) return;
        if (parseInt(event.target.value) > this.props.action.numberInput.max || parseInt(event.target.value) < this.props.action.numberInput.min ) {
            console.log(`Value exceeding limits! min${this.props.action.numberInput.min} max${this.props.action.numberInput.max} value${parseInt(event.target.value)}`)
            this.setState({ value: this.props.action.numberInput.max });
        } else {
            this.setState({value: parseInt(event.target.value)})
        }
    }

    render() { 
        if (!this.props.action) {
            return ( <div className="action" >
                <p>Error: Action info not provided</p>
            </div>)
        } else {
            if (this.props.action.numberInput) {
                return ( 
                    <div className="action">
                        <p onClick={() => this.props.reply(this.props.action.name, this.state.value)} >{this.props.action.name}</p>
                        <input onChange={this.handleInputChange} type="number" max={this.props.action.numberInput.max} min={this.props.action.numberInput.min} defaultValue={this.props.action.numberInput.placeholder}></input>
                    </div>
                 );
            } else {
                return ( 
                    <div className="action" onClick={() => this.props.reply(this.props.action.name, null)}>
                        <p>{this.props.action.name}</p>
                    </div>
                 );      
            }

        }

    }
}
 
export default ActionButton;
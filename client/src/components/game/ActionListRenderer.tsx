import * as React from 'react';
import { ActionList, Action, NumberAction } from "common/ActionList";
import ActionButton from './ActionButton';

interface ActionListRendererProps {
    reply: (name: string, number: number | null) => void;
    list: ActionList;
}
 
class ActionListRenderer extends React.Component<ActionListRendererProps> {
    constructor(props: ActionListRendererProps) {
        super(props);
    }

    render() { 
        return ( 
            <div className="action-list">
                {this.props.list.map((action => {
                    return ( <ActionButton action={action} reply={this.props.reply} /> )
                }))}
            </div>
         );
    }
}
 
export default ActionListRenderer;
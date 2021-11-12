import * as React from 'react';

interface LogProps {
    messages: string[];
}
 
class Log extends React.Component<LogProps> {
    render() { 
        return ( 
            <ul>
                {this.props.messages.map(m => <li className="log-item">{m}</li>)}
            </ul>
        );
    }
}
 
export default Log;
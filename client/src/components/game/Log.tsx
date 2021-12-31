import * as React from 'react';

interface LogProps {
    messages: string[];
}
 
class Log extends React.Component<LogProps> {
    render() { 
        return ( 
            <div className="log" >
                {
                //                  https://stackoverflow.com/a/5024096
                //                        ^
                this.props.messages.slice(0).reverse().map(m => <p className="log-item">{m}</p>)
                }
            </div>
        );
    }
}
 
export default Log;
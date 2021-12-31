import { NetPopup } from 'common/NetPopup';
import * as React from 'react';

interface PopupProps {
    popup: NetPopup;    
}
 
class Popup extends React.Component<PopupProps> {
    constructor(props: PopupProps) {
        super(props);
    }
    render() { 
        if (!this.props.popup.subtitle) {
                return (
                <div className="popup">
                    <p className="popup-body">{this.props.popup.title}</p>
                </div>
            );
        } else {
            return (
                <div className="popup">
                    <p className="popup-title">{this.props.popup.title}</p>
                    <p className="popup-subtitle">{this.props.popup.subtitle}</p>
                </div>
            );
        }
    }
}
 
export default Popup;
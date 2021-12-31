import * as React from 'react';
import { SquareDescription, SquareDescriptionValues } from "common/SquareDescription";

interface SquareInfoProps {
    squareDescription: SquareDescription | null
}

class SquareInfo extends React.Component<SquareInfoProps> {
    constructor(props: SquareInfoProps) {
        super(props);
    }
    render() { 
        if (this.props.squareDescription) {
            return ( 
                <div className="square">
                    <h3 className="square-name">{this.props.squareDescription.title}</h3>
                    <h4 className="square-rank">{"⭐".repeat(this.props.squareDescription.rank)}</h4>
                    <p>{this.props.squareDescription.baseText}</p>
                    {this.props.squareDescription.values.map(value => {
                        return (
                            <div className="square-values">
                                <p className="square-values-label">{value.label}</p>
                                <p className="square-values-value">{value.value}</p>
                            </div>
                        )
                    })}
                </div>
             );
        } else {
            return (null)
        }

    }
}
 
export default SquareInfo;
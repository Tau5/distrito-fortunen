import './App.css';
import { ConnectionGate } from "./components/ConnectionGate";
import { Component } from "react";


interface ContadorProps {
    name: string,
    initalCount: number,
    interval: number
};

interface ContadorState {
    counter: number,
    interval: number
}

class Contador extends Component<ContadorProps, ContadorState> {

    private counterInterval: number | undefined;

    constructor(props: ContadorProps) {
        super(props);
        this.state = {counter: this.props.initalCount, interval: this.props.interval};
        this.accelerateCounter = this.accelerateCounter.bind(this);
    }

    componentDidMount() { 
        this.createCounterInterval();
    }

    createCounterInterval() {
        this.counterInterval = window.setTimeout(() => {
            this.tick();
            this.createCounterInterval();
        }, this.state.interval);
    }

    componentWillUnmount() { 
        clearInterval(this.counterInterval);
    }

    tick() {
        this.setState((state, props) => ({
            counter: state.counter+1
        }));
    }

    accelerateCounter() {
        this.setState((state, props) => ({
            interval: state.interval * 0.9
        }));
    }

    render() {
        return (
            <div>
                <p><b>{this.props.name}</b>: {this.state.counter}</p>
                <button onClick={this.accelerateCounter}>Accelerate</button>
            </div>
        )
    }
}

function App() {

  return (
    <div>
        <ConnectionGate endpoint="localhost:3001"/>
    </div>
  );
}

export default App;

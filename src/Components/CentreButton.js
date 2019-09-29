import React, {Component} from 'react';
import './CentreButton.css';

class CentreButton extends Component {
    render(){
        return(
        <div>
            <div className="button-background"></div>
            <div className="button" onClick={this.props.onClick}></div>
        </div>
        );
    }
}

export default CentreButton;

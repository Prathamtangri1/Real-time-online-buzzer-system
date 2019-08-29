import React, {Component} from 'react';
import './CentreButton.css';

class CentreButton extends Component {
    render(){
        return(
        <div>
            <div class="button-background"></div>
            <div class="button" onClick={this.props.onClick}></div>
        </div>
        );
    }
}

export default CentreButton;

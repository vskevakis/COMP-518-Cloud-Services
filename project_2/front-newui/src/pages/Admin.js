import React, { Component } from "react";
import { Animate } from 'react-animate-mount'


class Admin extends Component {

    render() {
        return (
            <Animate type="fade" duration="1000" show={this.state.show}>
                <h2> Please visit keyrock on port 3001 to access the admin panel </h2>
            </Animate>
        );
    }
}

export default Admin;
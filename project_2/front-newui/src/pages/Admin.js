import React, { Component } from "react";
import { Animate } from 'react-animate-mount'


class Admin extends Component {

    render() {
        return (
            <div class="relative dark:bg-dark-dark bg-white min-h-full">
                <div class="max-w-7xl mx-auto">
                    <h2 class="center text-white dark:text-white"> Please visit keyrock on port 3001 to access the admin panel </h2>
                </div>
            </div>
        );
    }
}

export default Admin;
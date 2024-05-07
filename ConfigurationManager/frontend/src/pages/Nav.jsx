import React from "react";
import { NavLink, Link} from "react-router-dom"

function Nav() {
    return (
        //Nav Bar design taken from bootstraps website
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                <a className="navbar-brand" href="/">Config Manager</a>
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <a className="nav-link" href='/'>Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href='/buckets'>Buckets</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href='/rules'>Rules</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href='/import-export'>Import/Export</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href='/login'>Login</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;

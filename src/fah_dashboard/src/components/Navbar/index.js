import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Navbar = () => (
    <nav className="navbar navbar-expand navbar-light bg-dark border-bottom shadow-sm">
        <Link to="/" className="navbar-brand text-white">F@H Dashboard</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample02">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <Link to="/" className="nav-link text-white">Home</Link>
                    {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
                </li>
            </ul>
        </div>
    </nav>
);

export default withRouter(Navbar);
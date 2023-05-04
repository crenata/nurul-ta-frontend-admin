import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import Config from "../configs/Config";
import logo from "../images/logo.svg";
import IsEmpty from "../helpers/IsEmpty";
import {toast} from "react-toastify";
import AdminRole from "../helpers/AdminRole";

class Navbar extends PureComponent {
    logout() {
        Config.Axios.get("auth/logout").then(response => {
            if (response) {
                toast.success("Logged Out...");
                localStorage.removeItem(Config.TokenKey);
                setTimeout(() => {
                    window.location.href = Config.Links.Index;
                }, 1000);
            }
        });
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg fixed-top bg-dark d-block d-md-none">
                <div className="container-fluid bg-dark">
                    <Link to={Config.Links.Index} className="navbar-brand text-white d-flex align-items-center">
                        <img
                            src={logo}
                            alt="Brand"
                            width="36"
                            height="36"
                            className="logo"
                        />&nbsp;&nbsp;
                        <p className="m-0 text-white">Nurul TA</p>
                    </Link>
                    <button
                        className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#admin-navbar-content"
                        aria-controls="admin-navbar-content"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="admin-navbar-content">
                        <ul className="navbar-nav me-auto me-lg-0 ms-lg-auto mb-2 mb-lg-0">
                            {AdminRole(this.props.admin, Config.Routers.Home) &&
                            <li className="nav-item">
                                <Link to={Config.Links.Home} className="nav-link text-white">
                                    <p className="m-0">Home</p>
                                </Link>
                            </li>}
                            {AdminRole(this.props.admin, Config.Routers.Manage) &&
                            <li className="nav-item">
                                <Link to={Config.Links.Manage} className="nav-link text-white">
                                    <p className="m-0">Manage Admin</p>
                                </Link>
                            </li>}
                            {AdminRole(this.props.admin, Config.Routers.Articles) &&
                            <li className="nav-item">
                                <Link to={Config.Links.Articles} className="nav-link text-white">
                                    <p className="m-0">Articles</p>
                                </Link>
                            </li>}
                            {AdminRole(this.props.admin, Config.Routers.Categories) &&
                            <li className="nav-item">
                                <Link to={Config.Links.Categories} className="nav-link text-white">
                                    <p className="m-0">Categories</p>
                                </Link>
                            </li>}
                            {IsEmpty(Config.Token) ? <>
                                <li className="nav-item">
                                    <Link to={Config.Links.Login} className="nav-link text-white">
                                        <p className="m-0">Login</p>
                                    </Link>
                                </li>
                            </> : <>
                                <li className="nav-item">
                                    <a href="javascript:void(0)" onClick={event => this.logout()} className="nav-link text-white">
                                        <p className="m-0">Logout</p>
                                    </a>
                                </li>
                            </>}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

Navbar.propTypes = {
    admin: PropTypes.object
};

export default Navbar;

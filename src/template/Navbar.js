import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import Config from "../configs/Config";
import logo from "../images/logo.svg";
import IsEmpty from "../helpers/IsEmpty";
import {toast} from "react-toastify";
import AdminRole from "../helpers/AdminRole";
import Context from "../contexts/Context";

class Navbar extends PureComponent {
    logout() {
        Config.Axios.get("auth/logout").then(response => {
            if (response) {
                toast.success("Logged Out...");
                localStorage.removeItem(Config.TokenKey);
                setTimeout(() => {
                    window.location.href = Config.Links.Home;
                }, 1000);
            }
        });
    }

    render() {
        return (
            <Context.Consumer>
                {(context) => (
                    <nav className="navbar navbar-expand-lg fixed-top bg-dark d-block d-md-none">
                        <div className="container-fluid bg-dark">
                            <Link to={Config.Links.Home} className="navbar-brand text-white d-flex align-items-center">
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
                                    {AdminRole(context.admin, Config.Routers.Home) &&
                                    <li className="nav-item">
                                        <Link to={Config.Links.Home} className="nav-link text-white">
                                            <p className="m-0">Beranda</p>
                                        </Link>
                                    </li>}
                                    {AdminRole(context.admin, Config.Routers.Manage) &&
                                    <li className="nav-item">
                                        <Link to={Config.Links.Manage} className="nav-link text-white">
                                            <p className="m-0">Data Pegawai</p>
                                        </Link>
                                    </li>}
                                    {AdminRole(context.admin, Config.Routers.Activities) &&
                                    <li className="nav-item">
                                        <Link to={Config.Links.Activities} className="nav-link text-white">
                                            <p className="m-0">Aktifitas Pegawai</p>
                                        </Link>
                                    </li>}
                                    {AdminRole(context.admin, Config.Routers.Articles) &&
                                    <li className="nav-item">
                                        <Link to={Config.Links.Articles} className="nav-link text-white">
                                            <p className="m-0">Artikel</p>
                                        </Link>
                                    </li>}
                                    {AdminRole(context.admin, Config.Routers.Categories) &&
                                    <li className="nav-item">
                                        <Link to={Config.Links.Categories} className="nav-link text-white">
                                            <p className="m-0">Kategori</p>
                                        </Link>
                                    </li>}
                                    {AdminRole(context.admin, Config.Routers.Users) &&
                                    <li className="nav-item">
                                        <Link to={Config.Links.Users} className="nav-link text-white">
                                            <p className="m-0">Pasien</p>
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
                )}
            </Context.Consumer>
        );
    }
}

export default Navbar;

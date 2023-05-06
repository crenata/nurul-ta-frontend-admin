import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import Config from "../configs/Config";
import IsEmpty from "../helpers/IsEmpty";
import {toast} from "react-toastify";
import AdminRole from "../helpers/AdminRole";

class Sidebar extends PureComponent {
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
            <div className="d-none d-md-block bg-dark text-white app-sidebar">
                <div className="p-3">
                    <p className="m-0 text-center">Admin</p>
                </div>
                {!IsEmpty(this.props.admin) &&
                <div className="p-3 border">
                    <p className="m-0 text-center">{this.props.admin.name}</p>
                </div>}
                {AdminRole(this.props.admin, Config.Routers.Home) &&
                <Link to={Config.Links.Home} className="nav-link px-4 py-2">
                    <p className="m-0">Beranda</p>
                </Link>}
                {AdminRole(this.props.admin, Config.Routers.Manage) &&
                <Link to={Config.Links.Manage} className="nav-link px-4 py-2">
                    <p className="m-0">Data Pegawai</p>
                </Link>}
                {AdminRole(this.props.admin, Config.Routers.Activities) &&
                <Link to={Config.Links.Activities} className="nav-link px-4 py-2">
                    <p className="m-0">Aktifitas Pegawai</p>
                </Link>}
                {AdminRole(this.props.admin, Config.Routers.Articles) &&
                <Link to={Config.Links.Articles} className="nav-link px-4 py-2">
                    <p className="m-0">Artikel</p>
                </Link>}
                {AdminRole(this.props.admin, Config.Routers.Categories) &&
                <Link to={Config.Links.Categories} className="nav-link px-4 py-2">
                    <p className="m-0">Kategori</p>
                </Link>}
                <a href="javascript:void(0)" onClick={event => this.logout()} className="nav-link px-4 py-2">
                    <p className="m-0">Logout</p>
                </a>
            </div>
        );
    }
}

Sidebar.propTypes = {
    admin: PropTypes.object
};

export default Sidebar;

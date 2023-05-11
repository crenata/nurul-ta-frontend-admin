import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import Config from "../configs/Config";
import IsEmpty from "../helpers/IsEmpty";
import {toast} from "react-toastify";
import AdminRole from "../helpers/AdminRole";
import Context from "../contexts/Context";

class Sidebar extends PureComponent {
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
                    <div className="d-none d-md-block bg-dark text-white app-sidebar">
                        <div className="p-3">
                            <p className="m-0 text-center">Admin</p>
                        </div>
                        {!IsEmpty(context.admin) &&
                        <div className="p-3 border">
                            <p className="m-0 text-center">{context.admin.name}</p>
                        </div>}
                        {AdminRole(context.admin, Config.Routers.Home) &&
                        <Link to={Config.Links.Home} className="nav-link px-4 py-2">
                            <p className="m-0">Beranda</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.Manage) &&
                        <Link to={Config.Links.Manage} className="nav-link px-4 py-2">
                            <p className="m-0">Data Pegawai</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.Activities) &&
                        <Link to={Config.Links.Activities} className="nav-link px-4 py-2">
                            <p className="m-0">Aktifitas Pegawai</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.Articles) &&
                        <Link to={Config.Links.Articles} className="nav-link px-4 py-2">
                            <p className="m-0">Artikel</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.Categories) &&
                        <Link to={Config.Links.Categories} className="nav-link px-4 py-2">
                            <p className="m-0">Kategori</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.Users) &&
                        <Link to={Config.Links.Users} className="nav-link px-4 py-2">
                            <p className="m-0">Pasien</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.Medicines) &&
                        <Link to={Config.Links.Medicines} className="nav-link px-4 py-2">
                            <p className="m-0">Obat</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.Visits) &&
                        <Link to={Config.Links.Visits} className="nav-link px-4 py-2">
                            <p className="m-0">Kunjungan</p>
                        </Link>}
                        {AdminRole(context.admin, Config.Routers.MedicalRecords) &&
                        <Link to={Config.Links.MedicalRecords} className="nav-link px-4 py-2">
                            <p className="m-0">Rekam Medis</p>
                        </Link>}
                        <a href="javascript:void(0)" onClick={event => this.logout()} className="nav-link px-4 py-2">
                            <p className="m-0">Logout</p>
                        </a>
                    </div>
                )}
            </Context.Consumer>
        );
    }
}

export default Sidebar;

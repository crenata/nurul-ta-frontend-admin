import React, {PureComponent} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Config from "./configs/Config";
import RouteElement from "./helpers/RouteElement";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Articles from "./pages/Articles";
import Admin from "./pages/Admin";
import Categories from "./pages/Categories";
import Activities from "./pages/Activities";
import Users from "./pages/Users";
import Medicines from "./pages/Medicines";
import Visits from "./pages/Visits";
import MedicalRecords from "./pages/MedicalRecords";
import Receipts from "./pages/Receipts";
import Dashboard from "./pages/Dashboard";

class AppRoutes extends PureComponent {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={Config.Routers.Home} element={<RouteElement component={Dashboard} />} />
                    <Route path={Config.Routers.Login} element={<RouteElement component={Login} />} />
                    <Route path={Config.Routers.Articles} element={<RouteElement component={Articles} />} />
                    <Route path={Config.Routers.Categories} element={<RouteElement component={Categories} />} />
                    <Route path={Config.Routers.Activities} element={<RouteElement component={Activities} />} />
                    <Route path={Config.Routers.Users} element={<RouteElement component={Users} />} />
                    <Route path={Config.Routers.Medicines} element={<RouteElement component={Medicines} />} />
                    <Route path={Config.Routers.Visits} element={<RouteElement component={Visits} />} />
                    <Route path={Config.Routers.MedicalRecords} element={<RouteElement component={MedicalRecords} />} />
                    <Route path={Config.Routers.Receipts} element={<RouteElement component={Receipts} />} />
                    <Route path={Config.Routers.Manage} element={<RouteElement component={Admin} />} />
                    <Route path={Config.Routers.NotFound} element={<RouteElement component={NotFound} />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default AppRoutes;

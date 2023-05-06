import React, {PureComponent} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Config from "./configs/Config";
import RouteElement from "./helpers/RouteElement";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Articles from "./pages/Articles";
import Admin from "./pages/Admin";
import Template from "./template/Template";
import Categories from "./pages/Categories";
import Activities from "./pages/Activities";

class AppRoutes extends PureComponent {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={Config.Routers.Home} element={<RouteElement component={Template} />} />
                    <Route path={Config.Routers.Login} element={<RouteElement component={Login} />} />
                    <Route path={Config.Routers.Articles} element={<RouteElement component={Articles} />} />
                    <Route path={Config.Routers.Categories} element={<RouteElement component={Categories} />} />
                    <Route path={Config.Routers.Activities} element={<RouteElement component={Activities} />} />
                    <Route path={Config.Routers.Manage} element={<RouteElement component={Admin} />} />
                    <Route path={Config.Routers.NotFound} element={<RouteElement component={NotFound} />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default AppRoutes;

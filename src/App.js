import React, {PureComponent} from "react";
import AppRoutes from "./AppRoutes";
import Context from "./contexts/Context";
import Config from "./configs/Config";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";
import "react-toastify/dist/ReactToastify.min.css";
import {ToastContainer} from "react-toastify";
import IsEmpty from "./helpers/IsEmpty";

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            admin_token: Config.Token,
            user_token: Config.UserToken,
            loading: true,
            admin: null
        };
    }

    componentDidMount() {
        if (!IsEmpty(Config.Token)) this.getData();

        this.setState({
            loading: false
        });
    }

    getData() {
        Config.Axios.get("auth/self").then(response => {
            if (response) {
                this.setState({
                    admin: response.data.data
                });
            }
        });
    }

    render() {
        return (
            <Context.Provider value={this.state}>
                <AppRoutes />
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </Context.Provider>
        );
    }
}

export default App;

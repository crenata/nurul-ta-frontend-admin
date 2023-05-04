import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {toast} from "react-toastify";
import IsEmpty from "../helpers/IsEmpty";
import {Navigate} from "react-router-dom";

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    setValue(field, value) {
        this.setState({
            [field]: value
        });
    }

    login() {
        Config.Axios.post("auth/login", this.state).then(response => {
            if (response) {
                toast.success("Logged in...");
                localStorage.setItem(Config.TokenKey, response.data.data.token);
                setTimeout(() => {
                    window.location.href = Config.Links.Home;
                }, 1000);
            }
        });
    }

    render() {
        if (!IsEmpty(Config.Token)) return (
            <Navigate to={Config.Links.Home} />
        ); else return (
            <Template>
                <div className="container">
                    <div className="d-flex justify-content-center">
                        <div className="auth-form shadow rounded p-3">
                            <h3 className="m-0 text-center">Login</h3>
                            <div className="mt-3">
                                <label htmlFor="email" className="form-label">Email / Username</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={this.state.email}
                                    onChange={event => this.setValue("email", event.target.value)}
                                />
                            </div>
                            <div className="mt-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={event => this.setValue("password", event.target.value)}
                                />
                            </div>
                            <div className="text-center mt-3">
                                <button className="btn btn-dark" onClick={event => this.login()}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Template>
        );
    }
}

export default Login;

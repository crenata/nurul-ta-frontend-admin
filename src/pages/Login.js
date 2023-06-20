import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {toast} from "react-toastify";
import IsEmpty from "../helpers/IsEmpty";
import {Navigate} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            is_verified: false
        };
    }

    setValue(field, value) {
        this.setState({
            [field]: value
        });
    }

    login() {
        if (IsEmpty(this.state.email)) {
            toast.warning("The email/username field is required.");
            return;
        }
        if (IsEmpty(this.state.password)) {
            toast.warning("The password field is required.");
            return;
        }
        if (this.state.is_verified) {
            Config.Axios.post("auth/login", this.state).then(response => {
                if (response) {
                    toast.success("Logged in...");
                    localStorage.setItem(Config.TokenKey, response.data.data.token);
                    setTimeout(() => {
                        window.location.href = Config.Links.Home;
                    }, 1000);
                }
            });
        } else {
            toast.warning("Isi captcha dulu bos...");
        }
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
                            <div className="mt-3 d-flex justify-content-center">
                                <ReCAPTCHA
                                    sitekey="6LfCBLQmAAAAABIm8zt0Yxn9zgqulRK4A8MU-fZH"
                                    onChange={value => this.setValue("is_verified", true)}
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

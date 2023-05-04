import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {Navigate} from "react-router-dom";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Context from "../contexts/Context";
import Loading from "../helpers/loadings/Loading";
import Navbar from "./Navbar";
import "./Template.css";
import IsEmpty from "../helpers/IsEmpty";
import Config from "../configs/Config";
import Sidebar from "./Sidebar";

class Template extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            admin: null
        };
    }

    componentDidMount() {
        if (!IsEmpty(Config.Token)) this.getData();

        setTimeout(() => {
            const self = this;
            document.getElementsByClassName("app-content")[0].onscroll = function (e) {
                if (this.scrollTop > (this.scrollHeight - this.offsetHeight - 50) && !IsEmpty(self.props.onScroll)) self.props.onScroll();
            };
        }, 1000);
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
        const component = (
            <Context.Consumer>
                {(context) => (
                    <TransitionGroup className={`app position-relative ${this.props.className}`}>
                        <CSSTransition
                            key={context.loading}
                            timeout={1000}
                            classNames="fade-out"
                        >
                            {context.loading ? <Loading /> : <>
                                {!window.location.pathname.includes(Config.Links.Login) &&
                                <Navbar admin={this.state.admin} />}
                                <div className={!window.location.pathname.includes(Config.Links.Login) && `app-container`}>
                                    {!window.location.pathname.includes(Config.Links.Login) &&
                                    <Sidebar admin={this.state.admin} />}
                                    <div className="pt-5 pt-md-0 app-content">
                                        <div className="px-0 py-3 px-md-3 py-md-3">
                                            <div className="p-3">
                                                {this.props.children}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>}
                        </CSSTransition>
                    </TransitionGroup>
                )}
            </Context.Consumer>
        );
        if (window.location.pathname.includes(Config.Links.Login)) {
            return component;
        } else {
            if (IsEmpty(Config.Token)) return (
                <Navigate to={Config.Links.Login} />
            ); else return component;
        }
    }
}

Template.propTypes = {
    className: PropTypes.string,
    onScroll: PropTypes.func,
    onScrollParameter: PropTypes.number
};

export default Template;

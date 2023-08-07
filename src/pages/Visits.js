import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {toast} from "react-toastify";
import Context from "../contexts/Context";
import Constants from "../configs/Constants";
import moment from "moment";

class Visits extends PureComponent {
    constructor(props) {
        super(props);
        this.initialVisit = {
            id: 0,
            admin_id: "",
            category_id: "",
            date: ""
        };
        this.state = {
            visits: [],
            categories: [],
            admins: [],
            page: 1,
            isLastPage: false,
            isLoading: false,
            ...this.initialVisit
        };
    }

    componentDidMount() {
        this.getData();
        this.getCategory();
        this.getMidwafe();
    }

    isAdmin() {
        return this.context.admin?.type === Constants.AdminType.ADMINISTRATOR ||
            this.context.admin?.type === Constants.AdminType.ADMINISTRATOR_ADMIN;
    }
    isOfficer() {
        return this.context.admin?.type === Constants.AdminType.OFFICER;
    }

    getCategory() {
        Config.Axios.get("visit/get/category").then(response => {
            if (response) {
                this.setState({
                    categories: response.data.data
                });
            }
        });
    }

    getMidwafe() {
        Config.Axios.get("visit/get/midwafe").then(response => {
            if (response) {
                this.setState({
                    admins: response.data.data
                });
            }
        });
    }

    getData(isReload = false) {
        if (!this.state.isLoading && !this.state.isLastPage) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`visit/get/${this.isOfficer() ? "officer" : "admin"}?page=${this.state.page}`).then(response => {
                    if (response) {
                        const lastPage = response.data.data.last_page;
                        const isLastPage = lastPage === this.state.page;
                        if (isReload) {
                            this.setState({
                                visits: []
                            }, () => {
                                this.setState({
                                    visits: [...this.state.visits, ...response.data.data.data],
                                    page: isLastPage ? this.state.page : this.state.page + 1,
                                    isLastPage: isLastPage
                                });
                            });
                        } else {
                            this.setState({
                                visits: [...this.state.visits, ...response.data.data.data],
                                page: isLastPage ? this.state.page : this.state.page + 1,
                                isLastPage: isLastPage
                            });
                        }
                    }
                }).finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
            });
        }
    }

    submit() {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.post("visit/edit", {
                    id: this.state.id,
                    admin_id: this.state.admin_id,
                    category_id: this.state.category_id,
                    date: this.state.date
                }).then(response => {
                    if (response) {
                        toast.success("Successfully edited!");
                        this.setState({
                            isLastPage: false,
                            page: 1
                        }, () => {
                            this.getData(true);
                        });
                    }
                }).finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
            });
        }
    }

    delete(id) {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.delete(`visit/delete/${id}`).then(response => {
                    if (response) {
                        toast.success("Successfully deleted!");
                        this.setState({
                            isLastPage: false,
                            page: 1
                        }, () => {
                            this.getData(true);
                        });
                    }
                }).finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
            });
        }
    }

    approval(id, isApprove = true) {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`visit/${isApprove ? "approve" : "reject"}/${id}`).then(response => {
                    if (response) {
                        toast.success(`Successfully ${isApprove ? "approve" : "reject"}ed!`);
                        this.setState({
                            isLastPage: false,
                            page: 1
                        }, () => {
                            this.getData(true);
                        });
                    }
                }).finally(() => {
                    this.setState({
                        isLoading: false
                    });
                });
            });
        }
    }

    reset() {
        this.setState({
            ...this.initialVisit
        });
    }

    setEdit(data) {
        this.setState({
            ...data
        });
    }

    setValue(field, value) {
        this.setState({
            [field]: value
        });
    }

    render() {
        return (
            <Template onScroll={() => this.getData()}>
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="m-0">Visits</h4>
                </div>
                {this.state.visits.length > 0 ?
                    <div className="">
                        {this.state.visits.map(value => (
                            <div className="border rounded p-3 mt-3" key={value.id}>
                                <div className="row">
                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <p className="m-0">{value.user.name}</p>
                                    </div>
                                    <div className="col-12 col-md-2 d-flex align-items-center">
                                        <p className="m-0">{value.category.name}</p>
                                    </div>
                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <p className="m-0">{moment(value.date).format("lll")}</p>
                                    </div>
                                    <div className="col-12 col-md-2 d-flex align-items-center">
                                        <p className="m-0">{value.admin.name}</p>
                                    </div>
                                    <div className="col-12 col-md-2 d-flex align-items-center justify-content-end mt-3 mt-md-0">
                                        {this.isAdmin() && <>
                                            <button
                                                className="btn btn-dark"
                                                data-bs-toggle="modal"
                                                data-bs-target="#visit-modal"
                                                onClick={event => this.setEdit(value)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-pencil"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn btn-danger ms-3"
                                                onClick={event => this.delete(value.id)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-trash"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
                                                    />
                                                    <path
                                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
                                                    />
                                                </svg>
                                            </button>
                                        </>}
                                        {this.isOfficer() && <>
                                            <button
                                                className="btn btn-dark"
                                                onClick={event => this.approval(value.id)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-check-lg"viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn btn-danger ms-3"
                                                onClick={event => this.approval(value.id, false)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-x-lg"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                                                    />
                                                </svg>
                                            </button>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> :
                    <p className="mt-3 mb-0">Empty</p>}

                <div className="modal fade" id="visit-modal" tabIndex="-1" aria-labelledby="visit-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="visit-modal-label">Visit</h1>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={event => this.reset()}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="">
                                    <label htmlFor="admin" className="form-label">Bidan</label>
                                    <select
                                        className="form-select"
                                        id="admin"
                                        value={this.state.admin_id}
                                        onChange={event => this.setValue("admin_id", event.target.value)}
                                    >
                                        <option selected>Choose</option>
                                        {this.state.admins.map(value => (
                                            <option value={value.id} key={value.id}>{value.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        id="category"
                                        value={this.state.category_id}
                                        onChange={event => this.setValue("category_id", event.target.value)}
                                    >
                                        <option selected>Choose</option>
                                        {this.state.categories.map(value => (
                                            <option value={value.id} key={value.id}>{value.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="date"
                                        placeholder="Date"
                                        value={this.state.date}
                                        onChange={event => this.setValue("date", event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={event => this.reset()}
                                >Cancel</button>
                                <button
                                    className="btn btn-dark"
                                    data-bs-dismiss="modal"
                                    onClick={event => this.submit()}
                                >Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Template>
        );
    }
}

Visits.contextType = Context;

export default Visits;

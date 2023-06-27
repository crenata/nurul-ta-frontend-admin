import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {toast} from "react-toastify";
import Context from "../contexts/Context";
import Constants from "../configs/Constants";

class Users extends PureComponent {
    constructor(props) {
        super(props);
        this.initialUser = {
            id: 0,
            name: "",
            email: "",
            username: "",
            phone: "",
            birthplace: "",
            birthday: "",
            identity_number: "",
            medical_record_number: "",
            guardian: "",
            gender: "",
            address: ""
        };
        this.state = {
            users: [],
            page: 1,
            isLastPage: false,
            isLoading: false,
            ...this.initialUser
        };
    }

    componentDidMount() {
        this.getData();
    }

    isAdmin() {
        return this.context.admin?.type === Constants.AdminType.ADMINISTRATOR;
    }

    getData(isReload = false) {
        if (!this.state.isLoading && !this.state.isLastPage) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`user/get/${this.isAdmin() ? "admin" : "officer"}?page=${this.state.page}`).then(response => {
                    if (response) {
                        const lastPage = response.data.data.last_page;
                        const isLastPage = lastPage === this.state.page;
                        if (isReload) {
                            this.setState({
                                users: []
                            }, () => {
                                this.setState({
                                    users: [...this.state.users, ...response.data.data.data],
                                    page: isLastPage ? this.state.page : this.state.page + 1,
                                    isLastPage: isLastPage
                                });
                            });
                        } else {
                            this.setState({
                                users: [...this.state.users, ...response.data.data.data],
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
                Config.Axios.post("user/edit", {
                    id: this.state.id,
                    name: this.state.name,
                    email: this.state.email,
                    username: this.state.username,
                    phone: this.state.phone,
                    birthplace: this.state.birthplace,
                    birthday: this.state.birthday,
                    identity_number: this.state.identity_number,
                    medical_record_number: this.state.medical_record_number,
                    guardian: this.state.guardian,
                    gender: this.state.gender,
                    address: this.state.address
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
                Config.Axios.delete(`user/delete/${id}`).then(response => {
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
                Config.Axios.get(`user/${isApprove ? "approve" : "reject"}/${id}`).then(response => {
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
            ...this.initialUser
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
                    <h4 className="m-0">Users</h4>
                </div>
                {this.state.users.length > 0 ?
                    <div className="">
                        {this.state.users.map(value => (
                            <div className="border rounded mt-3" key={value.id}>
                                <div className="row">
                                    <div className="col-12 col-md-9 d-flex align-items-center">
                                        <div className="p-3 py-md-0">
                                            <p className="m-0">{value.name}</p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-3 d-flex align-items-center justify-content-end">
                                        <div className="p-3">
                                            {this.isAdmin() ? <>
                                                <button
                                                    className="btn btn-dark"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#user-modal"
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
                                            </> : <>
                                                <button
                                                    className="btn btn-dark"
                                                    onClick={event => this.approval(value.id)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-check-lg"
                                                        viewBox="0 0 16 16"
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
                            </div>
                        ))}
                    </div> :
                    <p className="mt-3 mb-0">Empty</p>}

                <div className="modal fade" id="user-modal" tabIndex="-1" aria-labelledby="user-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="user-modal-label">User</h1>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={event => this.reset()}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Name"
                                        value={this.state.name}
                                        onChange={event => this.setValue("name", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="email" className="form-label">Email</label>
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
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Username"
                                        value={this.state.username}
                                        onChange={event => this.setValue("username", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="phone" className="form-label">No. Telp</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phone"
                                        placeholder="No. Telp"
                                        value={this.state.phone}
                                        onChange={event => this.setValue("phone", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="birthplace" className="form-label">Tempat Lahir</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="birthplace"
                                        placeholder="Tempat Lahir"
                                        value={this.state.birthplace}
                                        onChange={event => this.setValue("birthplace", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="birthday" className="form-label">Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="birthday"
                                        placeholder="Tanggal Lahir"
                                        value={this.state.birthday}
                                        onChange={event => this.setValue("birthday", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="identity-number" className="form-label">Nomor Identitas</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="identity-number"
                                        placeholder="Nomor Identitas"
                                        value={this.state.identity_number}
                                        onChange={event => this.setValue("identity_number", event.target.value)}
                                    />
                                </div>
                                {/*<div className="mt-3">
                                    <label htmlFor="medical-record-number" className="form-label">Nomor Rekam Medis</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="medical-record-number"
                                        placeholder="Nomor Rekam Medis"
                                        value={this.state.medical_record_number}
                                        onChange={event => this.setValue("medical_record_number", event.target.value)}
                                    />
                                </div>*/}
                                <div className="mt-3">
                                    <label htmlFor="guardian" className="form-label">Wali</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="guardian"
                                        placeholder="Wali"
                                        value={this.state.guardian}
                                        onChange={event => this.setValue("guardian", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="gender" className="form-label">Jenis Kelamin</label>
                                    <select
                                        className="form-select"
                                        id="gender"
                                        value={this.state.gender}
                                        onChange={event => this.setValue("gender", event.target.value)}
                                    >
                                        <option selected>Choose</option>
                                        <option value={Constants.GenderType.MALE}>Pria</option>
                                        <option value={Constants.GenderType.FEMALE}>Wanita</option>
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="address" className="form-label">Alamat</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        id="address"
                                        placeholder="Alamat"
                                        value={this.state.address}
                                        onChange={event => this.setValue("address", event.target.value)}
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

Users.contextType = Context;

export default Users;

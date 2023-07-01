import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {toast} from "react-toastify";
import Constants from "../configs/Constants";
import Context from "../contexts/Context";
import moment from "moment";
import IsEmpty from "../helpers/IsEmpty";
import Download from "../helpers/Download";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class Receipts extends PureComponent {
    constructor(props) {
        super(props);
        this.initialReceipt = {
            id: 0,
            user_id: "",
            complaint: "",
            description: "",
            data: [
                {
                    medicine_id: "",
                    quantity: "",
                    dose: ""
                }
            ]
        };
        this.state = {
            transactions: [],
            currentTransaction: null,
            total_paid: "",
            users: [],
            medicines: [],
            services: [],
            page: 1,
            isLastPage: false,
            isLoading: false,
            isEdit: false,
            ...this.initialReceipt
        };
    }

    componentDidMount() {
        this.getData();
        this.getUser();
        this.getMedicine();
    }

    isAdmin() {
        return this.context.admin?.type === Constants.AdminType.ADMINISTRATOR;
    }

    isMidwafe() {
        return this.context.admin?.type === Constants.AdminType.MIDWAFE;
    }

    isPharmacist() {
        return this.context.admin?.type === Constants.AdminType.PHARMACIST;
    }

    isCashier() {
        return this.context.admin?.type === Constants.AdminType.CASHIER;
    }

    getUser() {
        Config.Axios.get("transaction/get/user").then(response => {
            if (response) {
                this.setState({
                    users: response.data.data
                });
            }
        });
    }

    getMedicine() {
        Config.Axios.get("transaction/get/medicine").then(response => {
            if (response) {
                this.setState({
                    medicines: response.data.data
                });
            }
        });
    }

    getData(isReload = false) {
        if (!this.state.isLoading && !this.state.isLastPage) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`transaction/get/${(this.isAdmin() || this.isMidwafe()) ? "midwafe" : this.isPharmacist() ? "pharmacist" : "cashier"}?page=${this.state.page}`).then(response => {
                    if (response) {
                        const lastPage = response.data.data.last_page;
                        const isLastPage = lastPage === this.state.page;
                        if (isReload) {
                            this.setState({
                                transactions: []
                            }, () => {
                                this.setState({
                                    transactions: [...this.state.transactions, ...response.data.data.data],
                                    page: isLastPage ? this.state.page : this.state.page + 1,
                                    isLastPage: isLastPage
                                });
                            });
                        } else {
                            this.setState({
                                transactions: [...this.state.transactions, ...response.data.data.data],
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
                Config.Axios.post(`transaction/${this.state.isEdit ? "edit" : "add"}`, {
                    id: this.state.id,
                    user_id: this.state.user_id,
                    complaint: this.state.complaint,
                    description: this.state.description,
                    data: this.state.data
                }).then(response => {
                    if (response) {
                        toast.success(`Successfully ${this.state.isEdit ? "edit" : "add"}ed!`);
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
                Config.Axios.delete(`transaction/delete/${id}`).then(response => {
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

    approval(isApprove = true) {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`transaction/${isApprove ? "approve" : "reject"}/${this.state.currentTransaction.id}`).then(response => {
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

    unpaid(id) {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`transaction/unpaid/${id}`).then(response => {
                    if (response) {
                        toast.success("Successfully cancelled!");
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

    generate(id) {
        this.setState({
            isLoading: true
        }, () => {
            Config.Axios.get(`transaction/generate/${id}`, {
                responseType: "blob"
            }).then(response => {
                if (response) {
                    Download(response.data, "Invoice.pdf");
                }
            }).finally(() => {
                this.setState({
                    isLoading: false
                });
            });
        });
    }

    paid() {
        let id = this.state.currentTransaction.id;
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.post("transaction/paid", {
                    id: id,
                    total_paid: this.state.total_paid,
                    services: this.state.services
                }).then(response => {
                    if (response) {
                        this.generate(id);
                        toast.success("Successfully processed!");
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
        this.initialReceipt.data = [
            {
                medicine_id: "",
                quantity: "",
                dose: ""
            }
        ];
        this.setState({
            ...this.initialReceipt
        });
    }

    setEdit(data) {
        let medicines = [];
        data.transaction_medicines.forEach(value => {
            medicines.push({
                medicine_id: value.medicine_id,
                quantity: value.quantity,
                dose: value.dose
            });
        });
        this.setState({
            ...data,
            data: medicines,
            isEdit: true
        });
    }

    setCurrentTransaction(data) {
        this.setState({
            currentTransaction: data,
            services: [],
            total_paid: ""
        });
    }

    setValue(field, value) {
        this.setState({
            [field]: value
        });
    }

    getTotalMedicines() {
        let total = 0;
        if (IsEmpty(this.state.currentTransaction)) return total;
        this.state.currentTransaction.transaction_medicines.forEach(value => {
            total += value.quantity * value.price;
        });
        return total;
    }

    getTotalServices() {
        let total = 0;
        if (IsEmpty(this.state.services)) return total;
        this.state.services.forEach(value => {
            let current = value.quantity * value.price;
            total += Number.isNaN(current) ? 0 : current;
        });
        return total;
    }

    getTotalAll() {
        return this.getTotalMedicines() + this.getTotalServices();
    }

    render() {
        return (
            <Template onScroll={() => this.getData()}>
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="m-0">Receipts</h4>
                    {(this.isAdmin() || this.isMidwafe()) &&
                    <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#transaction-modal"
                        onClick={event => {
                            this.reset();
                            this.setValue("isEdit", false);
                        }}
                    >Add</button>}
                </div>
                {this.state.transactions.length > 0 ?
                    <div className="">
                        {this.state.transactions.map(value => (
                            <div className="border rounded p-3 mt-3" key={value.id}>
                                <div className="row">
                                    <div className="col-12 col-md-5 d-flex align-items-center">
                                        <p className="m-0">{value.user.name}</p>
                                    </div>
                                    <div className="col-12 col-md-4 d-flex align-items-center">
                                        <p className="m-0">{moment(value.created_at).format("lll")}</p>
                                    </div>
                                    <div className="col-12 col-md-3 d-flex align-items-center justify-content-end mt-3 mt-md-0">
                                        {(this.isAdmin() || this.isMidwafe()) && <>
                                            <button
                                                className="btn btn-dark"
                                                data-bs-toggle="modal"
                                                data-bs-target="#transaction-modal"
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
                                        {this.isPharmacist() && <>
                                            <button
                                                className="btn btn-dark"
                                                data-bs-toggle="modal"
                                                data-bs-target="#pharmacist-modal"
                                                onClick={event => this.setCurrentTransaction(value)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-eye"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
                                                    />
                                                    <path
                                                        d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                                                    />
                                                </svg>
                                            </button>
                                        </>}
                                        {this.isCashier() && <>
                                            <button
                                                className="btn btn-dark"
                                                data-bs-toggle="modal"
                                                data-bs-target="#cashier-modal"
                                                onClick={event => this.setCurrentTransaction(value)}
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
                                                onClick={event => this.unpaid(value.id)}
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

                <div className="modal fade" id="transaction-modal" tabIndex="-1" aria-labelledby="transaction-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="transaction-modal-label">Receipt</h1>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={event => this.reset()}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="">
                                    <label htmlFor="user" className="form-label">User</label>
                                    <select
                                        className="form-select"
                                        id="user"
                                        value={this.state.user_id}
                                        onChange={event => this.setValue("user_id", event.target.value)}
                                    >
                                        <option selected>Choose</option>
                                        {this.state.users.map(value => (
                                            <option value={value.id} key={value.id}>{value.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="complaint" className="form-label">Keluhan</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={this.state.complaint}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            this.setValue("complaint", data);
                                        }}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="description" className="form-label">Keterangan</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={this.state.description}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            this.setValue("description", data);
                                        }}
                                    />
                                </div>
                                {this.state.data.map((value, index) => (
                                    <div className="mt-4 border-top" key={index}>
                                        <div className="mt-3">
                                            <label htmlFor={`medicine-${index}`} className="form-label">Obat</label>
                                            <select
                                                className="form-select"
                                                id={`medicine-${index}`}
                                                value={value.medicine_id}
                                                onChange={event => this.setState(prevState => ({
                                                    data: prevState.data.map(
                                                        (value, idx) => (idx === index ? Object.assign(value, {
                                                            medicine_id: event.target.value
                                                        }) : value)
                                                    )
                                                }))}
                                            >
                                                <option selected>Choose</option>
                                                {this.state.medicines.map(value => (
                                                    <option value={value.id} key={value.id}>{value.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mt-3">
                                            <label htmlFor={`quantity-${index}`} className="form-label">Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`quantity-${index}`}
                                                placeholder="Quantity"
                                                value={value.quantity}
                                                onChange={event => this.setState(prevState => ({
                                                    data: prevState.data.map(
                                                        (value, idx) => (idx === index ? Object.assign(value, {
                                                            quantity: event.target.value
                                                        }) : value)
                                                    )
                                                }))}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label htmlFor={`dose-${index}`} className="form-label">Dosis</label>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={value.dose}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    this.setState(prevState => ({
                                                        data: prevState.data.map(
                                                            (value, idx) => (idx === index ? Object.assign(value, {
                                                                dose: data
                                                            }) : value)
                                                        )
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-3 d-flex align-items-start justify-content-end">
                                    {this.state.data.length > 1 &&
                                    <button
                                        className="btn btn-danger"
                                        onClick={event => {
                                            let newData = [...this.state.data];
                                            newData.pop();
                                            this.setState({
                                                data: newData
                                            });
                                        }}
                                    >- Delete</button>}
                                    <button
                                        className="btn btn-dark ms-3"
                                        onClick={event => this.setState({
                                            data: [...this.state.data, {
                                                medicine_id: "",
                                                dose: ""
                                            }]
                                        })}
                                    >+ Add</button>
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
                <div className="modal modal-xl fade" id="pharmacist-modal" tabIndex="-1" aria-labelledby="pharmacist-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="pharmacist-modal-label">Receipt {!IsEmpty(this.state.currentTransaction) && `(${this.state.currentTransaction.user.name})`}</h1>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            {!IsEmpty(this.state.currentTransaction) &&
                            <div className="modal-body">
                                <h4 className="m-0">Obat</h4>
                                <div className="row mt-3">
                                    <div className="col-3">
                                        <p className="m-0">Nama Obat</p>
                                    </div>
                                    <div className="col-3">
                                        <p className="m-0">Dosis</p>
                                    </div>
                                    <div className="col-2 text-end">
                                        <p className="m-0">Quantity</p>
                                    </div>
                                    <div className="col-2 text-end">
                                        <p className="m-0">Harga</p>
                                    </div>
                                    <div className="col-2 text-end">
                                        <p className="m-0">Total</p>
                                    </div>
                                </div>
                                {this.state.currentTransaction.transaction_medicines.map((value, index) => (
                                    <div className="border-top pt-2 mt-2" key={index}>
                                        <div className="row">
                                            <div className="col-3">
                                                <p className="m-0">{value.name}</p>
                                            </div>
                                            <div className="col-3">
                                                <p className="m-0">{value.dose}</p>
                                            </div>
                                            <div className="col-2 text-end">
                                                <p className="m-0">{new Intl.NumberFormat().format(value.quantity)}</p>
                                            </div>
                                            <div className="col-2 text-end">
                                                <p className="m-0">Rp {new Intl.NumberFormat().format(value.price)}</p>
                                            </div>
                                            <div className="col-2 text-end">
                                                <p className="m-0">Rp {new Intl.NumberFormat().format(value.quantity * value.price)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="d-flex align-items-center justify-content-between border-top-dashed pt-2 mt-2">
                                    <h5 className="m-0 fw-bold">Total</h5>
                                    <h5 className="m-0 fw-bold">Rp {new Intl.NumberFormat().format(this.getTotalMedicines())}</h5>
                                </div>
                            </div>}
                            <div className="modal-footer">
                                <button
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={event => this.approval(false)}
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
                                <button
                                    className="btn btn-dark"
                                    data-bs-dismiss="modal"
                                    onClick={event => this.approval()}
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
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal modal-xl fade" id="cashier-modal" tabIndex="-1" aria-labelledby="cashier-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="cashier-modal-label">Receipt {!IsEmpty(this.state.currentTransaction) && `(${this.state.currentTransaction.user.name})`}</h1>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            {!IsEmpty(this.state.currentTransaction) &&
                            <div className="modal-body">
                                <div className="medicines">
                                    <h4 className="m-0">Obat</h4>
                                    <div className="row mt-3">
                                        <div className="col-3">
                                            <p className="m-0">Nama Obat</p>
                                        </div>
                                        <div className="col-3">
                                            <p className="m-0">Dosis</p>
                                        </div>
                                        <div className="col-2 text-end">
                                            <p className="m-0">Quantity</p>
                                        </div>
                                        <div className="col-2 text-end">
                                            <p className="m-0">Harga</p>
                                        </div>
                                        <div className="col-2 text-end">
                                            <p className="m-0">Total</p>
                                        </div>
                                    </div>
                                    {this.state.currentTransaction.transaction_medicines.map((value, index) => (
                                        <div className="border-top pt-2 mt-2" key={index}>
                                            <div className="row">
                                                <div className="col-3">
                                                    <p className="m-0">{value.name}</p>
                                                </div>
                                                <div className="col-3">
                                                    <p className="m-0">{value.dose}</p>
                                                </div>
                                                <div className="col-2 text-end">
                                                    <p className="m-0">{new Intl.NumberFormat().format(value.quantity)}</p>
                                                </div>
                                                <div className="col-2 text-end">
                                                    <p className="m-0">Rp {new Intl.NumberFormat().format(value.price)}</p>
                                                </div>
                                                <div className="col-2 text-end">
                                                    <p className="m-0">Rp {new Intl.NumberFormat().format(value.quantity * value.price)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="d-flex align-items-center justify-content-between border-top-dashed pt-2 mt-2">
                                        <h5 className="m-0 fw-bold">Total</h5>
                                        <h5 className="m-0 fw-bold">Rp {new Intl.NumberFormat().format(this.getTotalMedicines())}</h5>
                                    </div>
                                </div>
                                <div className="services border-top-dashed pt-3 mt-4">
                                    <h4 className="m-0">Tindakan</h4>
                                    <div className="row mt-3">
                                        <div className="col-3">
                                            <p className="m-0">Tindakan</p>
                                        </div>
                                        <div className="col-3">
                                            <p className="m-0">Keterangan</p>
                                        </div>
                                        <div className="col-2 text-end">
                                            <p className="m-0">Quantity</p>
                                        </div>
                                        <div className="col-2 text-end">
                                            <p className="m-0">Harga</p>
                                        </div>
                                        <div className="col-2 text-end">
                                            <p className="m-0">Total</p>
                                        </div>
                                    </div>
                                    {this.state.services.map((value, index) => (
                                        <div className="border-top pt-2 mt-2" key={index}>
                                            <div className="row">
                                                <div className="col-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Name"
                                                        value={value.name}
                                                        onChange={event => this.setState(prevState => ({
                                                            services: prevState.services.map(
                                                                (value, idx) => (idx === index ? Object.assign(value, {
                                                                    name: event.target.value
                                                                }) : value)
                                                            )
                                                        }))}
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Description"
                                                        value={value.description}
                                                        onChange={event => this.setState(prevState => ({
                                                            services: prevState.services.map(
                                                                (value, idx) => (idx === index ? Object.assign(value, {
                                                                    description: event.target.value
                                                                }) : value)
                                                            )
                                                        }))}
                                                    />
                                                </div>
                                                <div className="col-2">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Quantity"
                                                        value={value.quantity}
                                                        onChange={event => this.setState(prevState => ({
                                                            services: prevState.services.map(
                                                                (value, idx) => (idx === index ? Object.assign(value, {
                                                                    quantity: event.target.value
                                                                }) : value)
                                                            )
                                                        }))}
                                                    />
                                                </div>
                                                <div className="col-2">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Price"
                                                        value={value.price}
                                                        onChange={event => this.setState(prevState => ({
                                                            services: prevState.services.map(
                                                                (value, idx) => (idx === index ? Object.assign(value, {
                                                                    price: event.target.value
                                                                }) : value)
                                                            )
                                                        }))}
                                                    />
                                                </div>
                                                <div className="col-2 text-end">
                                                    <p className="m-0">Rp {(!IsEmpty(value.quantity) && !IsEmpty(value.price)) ? new Intl.NumberFormat().format(value.quantity * value.price) : 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="d-flex align-items-start justify-content-end mt-2">
                                        {this.state.services.length > 0 &&
                                        <button
                                            className="btn btn-danger"
                                            onClick={event => {
                                                let newData = [...this.state.services];
                                                newData.pop();
                                                this.setState({
                                                    services: newData
                                                });
                                            }}
                                        >- Delete</button>}
                                        <button
                                            className="btn btn-dark ms-3"
                                            onClick={event => this.setState({
                                                services: [...this.state.services, {
                                                    medicine_id: "",
                                                    dose: ""
                                                }]
                                            })}
                                        >+ Add</button>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between border-top-dashed pt-2 mt-2">
                                        <h5 className="m-0 fw-bold">Total</h5>
                                        <h5 className="m-0 fw-bold">Rp {new Intl.NumberFormat().format(this.getTotalServices())}</h5>
                                    </div>
                                </div>
                                <div className="total border-top-dashed pt-3 mt-4">
                                    <div className="d-flex align-items-center justify-content-between border-top-dashed pt-2 mt-2">
                                        <h5 className="m-0 fw-bold">Total Transaksi</h5>
                                        <h5 className="m-0 fw-bold">Rp {new Intl.NumberFormat().format(this.getTotalAll())}</h5>
                                    </div>
                                    <div className="row border-top-dashed pt-2 mt-2">
                                        <div className="col-12 col-md-8">
                                            <h5 className="m-0 fw-bold">Jumlah Yang Dibayar</h5>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <input
                                                type="number"
                                                className="form-control text-end"
                                                placeholder="Total Paid"
                                                value={this.state.total_paid}
                                                onChange={event => this.setValue("total_paid", event.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between border-top-dashed pt-2 mt-2">
                                        <h5 className="m-0 fw-bold">Jumlah Kembalian</h5>
                                        <h5 className="m-0 fw-bold">Rp {new Intl.NumberFormat().format(this.state.total_paid - this.getTotalAll())}</h5>
                                    </div>
                                </div>
                            </div>}
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >Cancel</button>
                                <button
                                    className="btn btn-dark"
                                    data-bs-dismiss="modal"
                                    onClick={event => this.paid()}
                                >Process</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Template>
        );
    }
}

Receipts.contextType = Context;

export default Receipts;

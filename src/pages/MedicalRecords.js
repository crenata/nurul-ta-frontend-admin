import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {toast} from "react-toastify";
import Constants from "../configs/Constants";
import Context from "../contexts/Context";
import IsEmpty from "../helpers/IsEmpty";
import moment from "moment";
import Download from "../helpers/Download";

class MedicalRecords extends PureComponent {
    constructor(props) {
        super(props);
        this.initialMedicalRecord = {
            id: 0,
            user_id: "",
            category_id: "",
            weight: "",
            height: "",
            action_date: "",
            blood_pressure: "",
            temperature: "",
            disease_history: "",
            complaint: "",
            treatment_given: "",
            marital_status: "",
            description: ""
        };
        this.state = {
            medical_records: [],
            categories: [],
            users: [],
            user: null,
            page: 1,
            isLastPage: false,
            isLoading: false,
            isEdit: false,
            ...this.initialMedicalRecord
        };
    }

    componentDidMount() {
        this.getData();
        this.getCategory();
        this.getUser();
    }

    isAdmin() {
        return this.context.admin?.type === Constants.AdminType.ADMINISTRATOR;
    }

    isMidwafe() {
        return this.context.admin?.type === Constants.AdminType.MIDWAFE;
    }

    isOfficer() {
        return this.context.admin?.type === Constants.AdminType.OFFICER;
    }

    getCategory() {
        Config.Axios.get("medical-record/get/category").then(response => {
            if (response) {
                this.setState({
                    categories: response.data.data
                });
            }
        });
    }

    getUser() {
        Config.Axios.get("medical-record/get/user").then(response => {
            if (response) {
                this.setState({
                    users: response.data.data
                });
            }
        });
    }

    getData(isReload = false) {
        if (!this.state.isLoading && !this.state.isLastPage) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`medical-record/get?page=${this.state.page}`).then(response => {
                    if (response) {
                        const lastPage = response.data.data.last_page;
                        const isLastPage = lastPage === this.state.page;
                        if (isReload) {
                            this.setState({
                                medical_records: []
                            }, () => {
                                this.setState({
                                    medical_records: [...this.state.medical_records, ...response.data.data.data],
                                    page: isLastPage ? this.state.page : this.state.page + 1,
                                    isLastPage: isLastPage
                                });
                            });
                        } else {
                            this.setState({
                                medical_records: [...this.state.medical_records, ...response.data.data.data],
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
                Config.Axios.post(`medical-record/${this.state.isEdit ? "edit" : "add"}`, {
                    id: this.state.id,
                    user_id: this.state.user.id,
                    category_id: this.state.category_id,
                    weight: this.state.weight,
                    height: this.state.height,
                    action_date: this.state.action_date,
                    blood_pressure: this.state.blood_pressure,
                    temperature: this.state.temperature,
                    disease_history: this.state.disease_history,
                    complaint: this.state.complaint,
                    treatment_given: this.state.treatment_given,
                    marital_status: this.state.marital_status,
                    description: this.state.description
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
                Config.Axios.delete(`medical-record/delete/${id}`).then(response => {
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

    generate() {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`medical-record/generate/${this.state.user.id}/0`, {
                    responseType: "blob"
                }).then(response => {
                    if (response) {
                        Download(response.data, "Medical Record.pdf");
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
            ...this.initialMedicalRecord
        });
    }

    setEdit(data) {
        this.setState({
            ...data,
            isEdit: true
        });
    }

    setCurrentUser(data) {
        this.setState({
            user: data
        });
    }

    setValue(field, value) {
        this.setState({
            [field]: value
        });
    }

    getMaritalStatus(type) {
        switch (type) {
            case Constants.MaritalStatus.SINGLE:
                return "Single";
            case Constants.MaritalStatus.MARRIED:
                return "Menikah";
            default:
                return "Unknown";
        }
    }

    getGender(type) {
        switch (type) {
            case Constants.GenderType.MALE:
                return "Pria";
            case Constants.GenderType.FEMALE:
                return "Wanita";
            default:
                return "Unknown";
        }
    }

    render() {
        return (
            <Template onScroll={() => this.getData()}>
                <h4 className="m-0">Medical Records</h4>
                {this.state.medical_records.length > 0 ?
                    <div className="">
                        {this.state.medical_records.map(value => (
                            <div className="border rounded p-3 mt-3" key={value.id}>
                                <div className="row">
                                    <div className="col-12 col-md-8 d-flex align-items-center">
                                        <p className="m-0">{value.name}</p>
                                    </div>
                                    <div className="col-12 col-md-4 d-flex align-items-center justify-content-end mt-3 mt-md-0">
                                        <button
                                            className="btn btn-dark"
                                            data-bs-toggle="modal"
                                            data-bs-target="#medical-record-review-modal"
                                            onClick={event => this.setCurrentUser(value)}
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> :
                    <p className="mt-3 mb-0">Empty</p>}

                <div className="modal modal-xl fade" id="medical-record-review-modal" tabIndex="-1" aria-labelledby="medical-record-review-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            {!IsEmpty(this.state.user) && <>
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="medical-record-review-modal-label">Medical Record</h1>
                                    <button
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={event => this.reset()}
                                    />
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4 className="m-0">{this.state.user.name}</h4>
                                        <div className="">
                                            <button
                                                className="btn btn-dark"
                                                onClick={event => this.generate()}
                                            >Generate</button>
                                            {(this.isAdmin() || this.isMidwafe()) &&
                                            <button
                                                className="btn btn-dark ms-3"
                                                data-bs-toggle="modal"
                                                data-bs-target="#medical-record-modal"
                                                onClick={event => {
                                                    this.reset();
                                                    this.setValue("isEdit", false);
                                                }}
                                            >Add</button>}
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-12 col-md-6">
                                            <p className="m-0">Tempat, Tanggal Lahir : {this.state.user.birthplace}, {moment(this.state.user.birthday).format("ll")}</p>
                                            <p className="m-0">Jenis Kelamin : {this.getGender(this.state.user.gender)}</p>
                                            <p className="m-0">Wali : {this.state.user.guardian}</p>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <p className="m-0">Tanggal Terdaftar : {moment(this.state.user.created_at).format("lll")}</p>
                                            <p className="m-0">Alamat : {this.state.user.address}</p>
                                        </div>
                                    </div>
                                    {this.state.user.medical_records.length > 0 ?
                                        <div className="">
                                            {this.state.user.medical_records.map(value => (
                                                <div className="border rounded p-3 mt-3" key={value.id}>
                                                    <div className="row">
                                                        <div className="col-12 col-md-11">
                                                            <div className="row">
                                                                <div className="col-12 col-md-4">
                                                                    <div className="">
                                                                        <p className="m-0">Kategori : {value.category.name}</p>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <p className="m-0">Berat Badan : {value.weight}</p>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <p className="m-0">Tinggi Badan : {value.height}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-4">
                                                                    <div className="mt-2 mt-md-0">
                                                                        <p className="m-0">Waktu Tindakan : {moment(value.action_date).format("ll")}</p>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <p className="m-0">Tekanan Darah : {value.blood_pressure}</p>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <p className="m-0">Suhu : {value.temperature} &deg;C</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-4">
                                                                    <div className="mt-2 mt-md-0">
                                                                        <p className="m-0">Status : {this.getMaritalStatus(value.marital_status)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 pt-3 border-top">
                                                                <p className="m-0">Riwayat Penyakit :</p>
                                                                <p className="m-0">{value.disease_history}</p>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="m-0">Keluhan :</p>
                                                                <p className="m-0">{value.complaint}</p>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="m-0">Pengobatan Yang Diberikan :</p>
                                                                <p className="m-0">{value.treatment_given}</p>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="m-0">Keterangan :</p>
                                                                <p className="m-0">{value.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-1 text-end mt-3 mt-md-0">
                                                            {(this.isAdmin() || this.isMidwafe()) &&
                                                            <button
                                                                className="btn btn-dark"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#medical-record-modal"
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
                                                            </button>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div> :
                                        <p className="mt-3 mb-0">Empty</p>}
                                </div>
                            </>}
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={event => this.reset()}
                                >Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="medical-record-modal" tabIndex="-1" aria-labelledby="medical-record-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="medical-record-modal-label">Medical Record ({this.state.user?.name})</h1>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={event => this.reset()}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="">
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
                                    <label htmlFor="weight" className="form-label">Berat Badan (kg)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="weight"
                                        placeholder="Berat Badan (kg)"
                                        value={this.state.weight}
                                        onChange={event => this.setValue("weight", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="height" className="form-label">Tinggi Badan (cm)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="height"
                                        placeholder="Tinggi Badan (cm)"
                                        value={this.state.height}
                                        onChange={event => this.setValue("height", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="action-date" className="form-label">Waktu Tindakan</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="action-date"
                                        placeholder="Waktu Tindakan"
                                        value={this.state.action_date}
                                        onChange={event => this.setValue("action_date", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="blood-pressure" className="form-label">Tekanan Darah</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="blood-pressure"
                                        placeholder="Tekanan Darah"
                                        value={this.state.blood_pressure}
                                        onChange={event => this.setValue("blood_pressure", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="temperature" className="form-label">Suhu (&deg;C)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="temperature"
                                        placeholder="Suhu (&deg;C)"
                                        value={this.state.temperature}
                                        onChange={event => this.setValue("temperature", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="marital-status" className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        id="marital-status"
                                        value={this.state.marital_status}
                                        onChange={event => this.setValue("marital_status", event.target.value)}
                                    >
                                        <option selected>Choose</option>
                                        <option value={Constants.MaritalStatus.SINGLE}>Single</option>
                                        <option value={Constants.MaritalStatus.MARRIED}>Menikah</option>
                                    </select>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="disease-history" className="form-label">Riwayat Penyakit</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        id="disease-history"
                                        placeholder="Riwayat Penyakit"
                                        value={this.state.disease_history}
                                        onChange={event => this.setValue("disease_history", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="complaint" className="form-label">Keluhan</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        id="complaint"
                                        placeholder="Keluhan"
                                        value={this.state.complaint}
                                        onChange={event => this.setValue("complaint", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="treatment-given" className="form-label">Pengobatan Yang Diberikan</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        id="treatment-given"
                                        placeholder="Pengobatan Yang Diberikan"
                                        value={this.state.treatment_given}
                                        onChange={event => this.setValue("treatment_given", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="description" className="form-label">Keterangan</label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        id="description"
                                        placeholder="Keterangan"
                                        value={this.state.description}
                                        onChange={event => this.setValue("description", event.target.value)}
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

MedicalRecords.contextType = Context;

export default MedicalRecords;

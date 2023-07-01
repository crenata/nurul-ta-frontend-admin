import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {toast} from "react-toastify";
import Constants from "../configs/Constants";
import TextTruncate from "../helpers/texts/TextTruncate";
import IsEmpty from "../helpers/IsEmpty";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

class Articles extends PureComponent {
    constructor(props) {
        super(props);
        this.initialArticle = {
            id: 0,
            title: "",
            description: "",
            image: "",
            image_preview: "",
            type: ""
        };
        this.state = {
            articles: [],
            page: 1,
            isLastPage: false,
            isLoading: false,
            isEdit: false,
            ...this.initialArticle
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData(isReload = false) {
        if (!this.state.isLoading && !this.state.isLastPage) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`article/get?page=${this.state.page}`).then(response => {
                    if (response) {
                        const lastPage = response.data.data.last_page;
                        const isLastPage = lastPage === this.state.page;
                        if (isReload) {
                            this.setState({
                                articles: []
                            }, () => {
                                this.setState({
                                    articles: [...this.state.articles, ...response.data.data.data],
                                    page: isLastPage ? this.state.page : this.state.page + 1,
                                    isLastPage: isLastPage
                                });
                            });
                        } else {
                            this.setState({
                                articles: [...this.state.articles, ...response.data.data.data],
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
                const formData = new FormData();
                formData.append("id", this.state.id);
                formData.append("title", this.state.title);
                formData.append("description", this.state.description);
                formData.append("image", this.state.image);
                formData.append("type", this.state.type);
                Config.Axios.post(`article/${this.state.isEdit ? "edit" : "add"}`, formData).then(response => {
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
                Config.Axios.delete(`article/delete/${id}`).then(response => {
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

    reset() {
        this.setState({
            ...this.initialArticle
        }, () => {
            document.getElementById("image").value = "";
        });
    }

    setEdit(data) {
        this.setState({
            ...data,
            image_preview: data.image,
            isEdit: true
        });
    }

    setValue(field, value) {
        this.setState({
            [field]: value
        }, () => {
            if (field === "image") this.setState({
                image_preview: URL.createObjectURL(value)
            });
        });
    }

    getType(type) {
        switch (type) {
            case Constants.ArticleType.HOME:
                return "Beranda";
            case Constants.ArticleType.FACILITY:
                return "Fasilitas";
            case Constants.ArticleType.SERVICE:
                return "Layanan";
            case Constants.ArticleType.SCHEDULE:
                return "Jadwal Bidan";
            default:
                return "Unknown";
        }
    }

    render() {
        return (
            <Template onScroll={() => this.getData()}>
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="m-0">Articles</h4>
                    <button
                        className="btn btn-dark"
                        data-bs-toggle="modal"
                        data-bs-target="#article-modal"
                        onClick={event => {
                            this.reset();
                            this.setValue("isEdit", false);
                        }}
                    >Add</button>
                </div>
                {this.state.articles.length > 0 ?
                    <div className="">
                        {this.state.articles.map(value => (
                            <div className="border rounded mt-3" key={value.id}>
                                <div className="row">
                                    <div className="col-12 col-md-2">
                                        <img src={value.image} alt="Image" style={{height: "7rem"}} className="w-100 object-fit-cover"/>
                                    </div>
                                    <div className="col-12 col-md-7 d-flex align-items-center">
                                        <div className="p-3 py-md-0">
                                            <p className="m-0">{this.getType(value.type)}</p>
                                            <p className="mt-1 mb-0">{value.title}</p>
                                            <TextTruncate lineClamp={2} className="mt-2 mb-0">{value.description}</TextTruncate>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-3 d-flex align-items-center justify-content-end">
                                        <div className="p-3">
                                            <button
                                                className="btn btn-dark"
                                                data-bs-toggle="modal"
                                                data-bs-target="#article-modal"
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> :
                    <p className="mt-3 mb-0">Empty</p>}

                <div className="modal fade" id="article-modal" tabIndex="-1" aria-labelledby="article-modal-label" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="article-modal-label">Article</h1>
                                <button
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={event => this.reset()}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        placeholder="Title"
                                        value={this.state.title}
                                        onChange={event => this.setValue("title", event.target.value)}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={this.state.description}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            this.setValue("description", data);
                                        }}
                                    />
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="image" className="form-label">Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="image"
                                        placeholder="Image"
                                        accept="image/*"
                                        onChange={event => this.setValue("image", event.target.files[0])}
                                    />
                                    {!IsEmpty(this.state.image_preview) &&
                                    <img src={this.state.image_preview} alt="Preview" className="w-100 object-fit-cover" />}
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="type" className="form-label">Type</label>
                                    <select
                                        className="form-select"
                                        id="type"
                                        value={this.state.type}
                                        onChange={event => this.setValue("type", event.target.value)}
                                    >
                                        <option selected>Choose</option>
                                        <option value={Constants.ArticleType.HOME}>Beranda</option>
                                        <option value={Constants.ArticleType.FACILITY}>Fasilitas</option>
                                        <option value={Constants.ArticleType.SERVICE}>Layanan</option>
                                        <option value={Constants.ArticleType.SCHEDULE}>Jadwal Bidan</option>
                                    </select>
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

export default Articles;

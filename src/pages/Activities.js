import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import moment from "moment";
import Constants from "../configs/Constants";

class Activities extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            page: 1,
            isLastPage: false,
            isLoading: false
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
                Config.Axios.get(`activity/get?page=${this.state.page}`).then(response => {
                    if (response) {
                        const lastPage = response.data.data.last_page;
                        const isLastPage = lastPage === this.state.page;
                        if (isReload) {
                            this.setState({
                                activities: []
                            }, () => {
                                this.setState({
                                    activities: [...this.state.activities, ...response.data.data.data],
                                    page: isLastPage ? this.state.page : this.state.page + 1,
                                    isLastPage: isLastPage
                                });
                            });
                        } else {
                            this.setState({
                                activities: [...this.state.activities, ...response.data.data.data],
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

    getType(type) {
        switch (type) {
            case Constants.AdminType.ADMINISTRATOR:
                return "Administrator";
            case Constants.AdminType.MIDWAFE:
                return "Bidan";
            case Constants.AdminType.PHARMACIST:
                return "Farmasi";
            case Constants.AdminType.OFFICER:
                return "Administrasi";
            case Constants.AdminType.CASHIER:
                return "Kasir";
            default:
                return "Unknown";
        }
    }

    render() {
        return (
            <Template onScroll={() => this.getData()}>
                <h4 className="m-0">Activities</h4>
                {this.state.activities.length > 0 ?
                    <div className="">
                        {this.state.activities.map(value => (
                            <div className="border rounded p-3 mt-3" key={value.id}>
                                <div className="row">
                                    <div className="col-12 col-md-2">
                                        <p className="m-0">{value.admin.name}</p>
                                    </div>
                                    <div className="col-12 col-md-2">
                                        <p className="m-0">{this.getType(value.admin.type)}</p>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <p className="m-0">{value.text}</p>
                                    </div>
                                    <div className="col-12 col-md-2 text-end">
                                        <p className="m-0">{moment(value.created_at).format("lll")}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> :
                    <p className="mt-3 mb-0">Empty</p>}
            </Template>
        );
    }
}

export default Activities;

import React, {PureComponent} from "react";
import Template from "../template/Template";
import Config from "../configs/Config";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import IsEmpty from "../helpers/IsEmpty";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class Dashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            isLoading: false
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        if (!this.state.isLoading) {
            this.setState({
                isLoading: true
            }, () => {
                Config.Axios.get(`dashboard/get?filter=${this.state.filter}`).then(response => {
                    if (response) {
                        this.setState({
                            data: response.data.data
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

    render() {
        return (
            <Template onScroll={() => this.getData()}>
                <h4 className="m-0">Dashboard</h4>
                <div className="row mt-3">
                    <div className="col-12 col-md-4 offset-md-8">
                        <select
                            className="form-select"
                            value={this.state.filter}
                            onChange={event => this.setState({
                                filter: event.target.value
                            }, () => {
                                this.getData();
                            })}
                        >
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="daily">Daily</option>
                        </select>
                    </div>
                </div>
                {!IsEmpty(this.state.data) &&
                <Bar
                    options={{
                        responsive: true,
                    }}
                    data={this.state.data}
                />}
            </Template>
        );
    }
}

export default Dashboard;

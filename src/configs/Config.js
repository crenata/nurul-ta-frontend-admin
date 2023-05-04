import axios from "axios";
import {loadProgressBar} from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";
import {toast} from "react-toastify";

const tokenKey = "admin_token";
const token = localStorage.getItem(tokenKey);

const interceptorsError = (error) => {
    if (error.response.data) {
        if (error.response.data.status === 401) {
            localStorage.removeItem(tokenKey);
            toast.error(error.response.data.message);
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } else if (error.response.data.status === 500) {
            toast.error(error.response.data.message);
        } else {
            toast.warn(error.response.data.message);
        }
    } else {
        toast.error("Whoops, something went wrong!");
    }
};
const instanceAxios = () => {
    const instance = axios.create({
        baseURL: `${process.env.REACT_APP_BASE_URL}/admin`,
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    instance.interceptors.response.use(response => response, interceptorsError);
    loadProgressBar(null, instance);
    return instance;
};

const Config = {
    Routers: {
        NotFound: "*",
        Home: "//*",
        Login: "login",
        Articles: "articles",
        Categories: "categories",
        Manage: "manage"
    },
    Links: {
        Home: "/",
        Login: "/login",
        Articles: "/articles",
        Categories: "/categories",
        Manage: "/manage"
    },
    TokenKey: tokenKey,
    Token: token,
    Axios: instanceAxios()
};

export default Config;

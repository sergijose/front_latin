import axios from "axios";

export const URL_BASE = "http://127.0.0.1:8000/api";
// export const URL_BASE = "https://app1-laravel.blumbit.net/back/public/api";

export default function Api(){

    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: URL_BASE,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+token
        }
    });

    // interceptor
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // error de autenticación
            if(error.response.status === 401){
                console.log("INTERCEPTOR ************");
                localStorage.removeItem("access_token")
                
                window.location.href ="/auth/login"
            }
            return Promise.reject(error);
        }
    );

    return api;
}

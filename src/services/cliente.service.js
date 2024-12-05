import Api from "./api.service"

export default {
    index: (page = 1, limit = 5, q = "") => {
        return Api().get(`/cliente?page=${page}&limit=${limit}&q=`+q);
    },
    store: (datos) => {
        return Api().post("/cliente", datos);
    },
    show: (id) => {
        return Api().get(`/cliente/${id}`);
    },
    buscarCliente: (buscar) => {
        return Api().get(`/cliente-buscar?q=${buscar}`);
    }
}
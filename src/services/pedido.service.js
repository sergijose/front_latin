import Api from "./api.service"

export default {
    index: (page = 1, limit = 5, q = "") => {
        return Api().get(`/pedido?page=${page}&limit=${limit}&q=`+q);
    },
    store: (datos) => {
        return Api().post("/pedido", datos);
    },
    show: (id) => {
        return Api().get(`/pedido/${id}`);
    },
}
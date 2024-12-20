import Api from "./api.service"

export default {
    listar: (page = 1, limit = 5, q = "") => {
        return Api().get(`/producto-detalle?page=${page}&limit=${limit}&q=`+q);
    },
    guardar: (datos) => {
        return Api().post("/producto-detalle", datos);
    },
    mostrar: (id) => {
        return Api().get(`/producto-detalle/${id}`);
    },
    modificar: (id, datos) => {
        return Api().put(`/producto-detalle/${id}`, datos);
    },
    eliminar: (id) => {
        return Api().delete(`/producto-detalle/${id}`);
    },
}
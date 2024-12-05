import Api from "./api.service"

export default {
    listar: (page = 1, limit = 5, q = "") => {
        return Api().get(`/producto?page=${page}&limit=${limit}&q=`+q);
    },
    guardar: (datos) => {
        return Api().post("/producto", datos);
    },
    guardarConImagen: (datos) => {
        return Api().post("/producto", datos);
    },
    mostrar: (id) => {
        return Api().get(`/producto/${id}`);
    },
    modificar: (id, datos) => {
        return Api().post(`/producto/${id}`, datos);
    },
    eliminar: (id) => {
        return Api().delete(`/producto/${id}`);
    },
}
import Api from "./api.service"

export default {
    listar: (page = 1, limit = 5, q = "") => {
        return Api().get(`/categoria?page=${page}&limit=${limit}&q=`+q);
    },
    guardar: (datos) => {
        return Api().post("/categoria", datos);
    },
    mostrar: (id) => {
        return Api().get(`/categoria/${id}`);
    },
    modificar: (id, datos) => {
        return Api().put(`/categoria/${id}`, datos);
    },
    eliminar: (id) => {
        return Api().delete(`/categoria/${id}`);
    },
    listarCategoria: () => {
        return Api().get(`/categoria-listar`);
    }
}
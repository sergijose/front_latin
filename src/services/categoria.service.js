import Api from "./api.service"

export default {
    listar: (q = "") => {
        return Api().get("/categoria?q="+q);
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
}
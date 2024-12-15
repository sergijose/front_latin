import Api from "./api.service"

export default {
    listar: (page = 1, limit = 5, q = "") => {
       return Api().get(`/empleado?page=${page}&limit=${limit}&q=`+q);
    },
    guardar: (datos) => {
        return Api().post("/empleado", datos);
    },
    mostrar: (id) => {
        return Api().get(`/empleado/${id}`);
    },
    modificar: (id, datos) => {
        return Api().put(`/empleado/${id}`, datos);
    },
    eliminar: (id) => {
        return Api().delete(`/empleado/${id}`);
    },
    listarCategoria: () => {
        return Api().get(`/empleado-listar`);
    },
    asignarUsuario: (id, datos) => {
        return Api().put(`/empleado/${id}/assign-user`, datos); // Ajustar la ruta
    },
}
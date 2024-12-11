<template>
    <div class="card">


        <!-- Título y botón de agregar -->
        <h2 class="text-xl font-semibold mb-4">Gestion de Categorias</h2>

        <Button label="Agregar Categoria" @click="nuevaCategoria()" />
        <!---->
        <Dialog v-model:visible="visible_categoria" modal header="Ingrese Datos de Categoria"  @hide="resetForm"
            :style="{ width: '25rem' } ">


            <div class="flex items-center gap-4 mb-4">
                <label for="nom" class="font-semibold w-24">Nombre</label>
                <InputText id="nom" class="flex-auto" autocomplete="off" v-model.trim="categoria.nombre"
                    :invalid="submitted && !categoria.nombre" fluid />
                <small v-if="errors.nombre" class="text-red-500">
                    {{ errors.nombre }}
                </small>
                <small v-else-if="submitted && !categoria.nombre" class="text-red-500">
                    El nombre de la categoría es obligatorio.
                </small>
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="det" class="font-semibold w-24">Detalle</label>
                <InputText id="det" class="flex-auto" autocomplete="off" v-model="categoria.detalle" />
                {{ errors.detalle }}
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="resetForm"></Button>
                <Button type="button" label="Guardar" @click="funGuardarCategoria()"></Button>
            </div>
        </Dialog>

        <DataTable ref="dt" dataKey="id" lazy :totalRecords="totalRecords" :loading="loading" :paginator="true"
            :rows="10" @page="onPage($event)"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[3, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" :value="categorias"
            tableStyle="min-width: 50rem">

            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Gestion Categoria</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Buscar..." v-model="buscar" @change="getCategorias()" />
                    </IconField>
                </div>
            </template>

            <!-- Columnas -->
            <Column field="id" header="ID" sortable></Column>
            <Column field="nombre" header="Nombre" sortable></Column>
            <Column field="detalle" header="Detalle" sortable></Column>

            <!-- Columna de acciones -->
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editarCategoria(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="eliminarCategoria(slotProps.data)" />
                    </div>
                </template>
            </Column>
        </DataTable>

    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import categoriaService from "./../../../services/categoria.service";
import Swal from 'sweetalert2'

const categorias = ref([]);
const visible_categoria = ref(false)
const categoria = ref({});
const errors = ref({})
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});
const buscar = ref("")
const submitted = ref(false);

onMounted(() => {
    loading.value = true;
    lazyParams.value = {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
    };
    getCategorias();
});


const getCategorias = async () => {
    loading.value = true;
    const { data } = await categoriaService.listar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);

    categorias.value = data.data;
    totalRecords.value = data.total;
    loading.value = false

};

const onPage = (event) => {
    lazyParams.value = event;
    getCategorias(event);
};

const nuevaCategoria = () => {
    categoria.value = {};
    submitted.value = false;
    visible_categoria.value = true;
}

const funGuardarCategoria = async () => {
    submitted.value = true; // Activar validación del frontend

    // Limpiar errores previos antes de la validación
    errors.value = {};

    // Validación del frontend: Asegurarse de que el campo requerido no esté vacío
    if (!categoria?.value.nombre?.trim()) {
        errors.value.nombre = "El nombre de la categoría es obligatorio.";
        return; // Detener ejecución si falla la validación del frontend
    }

    try {
        let mensaje = "";

        if (categoria.value.id) {
            // Si existe un ID, se está editando
            const { data } = await categoriaService.modificar(categoria.value.id, categoria.value);

            mensaje = "Categoría modificada correctamente.";
        } else {
            // Si no hay ID, se está creando
            const { data } = await categoriaService.guardar(categoria.value);

            mensaje = "Categoría registrada correctamente.";
        }

        // Actualización de la lista y reseteo del formulario
        getCategorias();
        categoria.value = {};
        visible_categoria.value = false;
        errors.value = {}; // Limpiar errores

        // Mostrar notificación de éxito
        Swal.fire({
            title: "Operación exitosa",
            text: mensaje,
            icon: "success",
            confirmButtonText: "Aceptar",
        });
    } catch (error) {
        // Captura y manejo de errores del backend
        if (error.response && error.response.data?.errors) {
            const backendErrors = error.response.data.errors;

            // Manejo flexible según el tipo de respuesta
            if (Array.isArray(backendErrors)) {
                errors.value.general = backendErrors; // Errores generales
            } else {
                errors.value = backendErrors; // Errores específicos por campo
            }
        } else {
            console.error("Error inesperado:", error);
        }
    }
};
const editarCategoria = async (datos) => {
    categoria.value = datos;
    visible_categoria.value = true;
}

const eliminarCategoria = async (categoria) => {
    try {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            await categoriaService.eliminar(categoria.id); // Llamada al servicio para eliminar
            await getCategorias(); // Actualizar la lista de categorías
            await Swal.fire({
                title: "¡Eliminado!",
                text: "La categoría ha sido eliminada correctamente.",
                icon: "success",
            });
        }
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un problema al intentar eliminar la categoría.",
            icon: "error",
        });
    }
};

const resetForm = () => {
    submitted.value = false; // Reinicia la validación del frontend
    errors.value = {};       // Limpia los errores del backend
    categoria.value = {};    // Reinicia el modelo de la categoría
    visible_categoria.value = false; // Cierra el modal
};
</script>

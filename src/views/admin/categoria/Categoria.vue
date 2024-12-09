<template>
    <div class="card">


        <!-- Título y botón de agregar -->
        <h2 class="text-xl font-semibold mb-4">Gestion de Categorias</h2>

        <Button label="Registrar Nueva Categoria" @click="visible_categoria = true" />

        <Dialog v-model:visible="visible_categoria" modal header="Ingrese Datos de Categoria"
            :style="{ width: '25rem' }">

            <span class="text-surface-500 dark:text-surface-400 block mb-8">Categoria.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="nom" class="font-semibold w-24">Nombre</label>
                <InputText id="nom" class="flex-auto" autocomplete="off" v-model="categoria.nombre" />
                {{ errors.nombre }}
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="det" class="font-semibold w-24">Detalle</label>
                <InputText id="det" class="flex-auto" autocomplete="off" v-model="categoria.detalle" />
                {{ errors.detalle }}
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visible_categoria = false"></Button>
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
                <InputText  placeholder="Buscar..." v-model="buscar" @change="getCategorias()" />
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
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info"
                            @click="editarCategoria(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger"
                            @click="eliminarCategoria(slotProps.data.id)" />
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

onMounted(() => {
    loading.value = true;
    getCategorias();
});
lazyParams.value = {
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
};

const getCategorias = async () => {
    loading.value = true;
    const { data } = await categoriaService.listar(lazyParams.value.page+1, lazyParams.value.rows, buscar.value);

   categorias.value = data.data;
    totalRecords.value = data.total;
    loading.value = false
  
};

const onPage = (event) => {
    lazyParams.value = event;
    getProductos(event);
};

const funGuardarCategoria = async () => {
    try {
        if (categoria.value.id) {

            const { data } = await categoriaService.modificar(categoria.value.id, categoria.value)

            getCategorias();
            categoria.value = {}

            Swal.fire({
                title: "Categoria Modificado Correctamente",
                text: "Click Para continuar",
                icon: "success"
            });

        } else {
            const { data } = await categoriaService.guardar(categoria.value)

            getCategorias();
            categoria.value = {}

            Swal.fire({
                title: "Categoria Registrado Correctamente",
                text: "Click Para continuar",
                icon: "success"
            });

        }
        visible_categoria.value = false

    } catch (error) {
        errors.value = error.response.data?.errors;
    }


}

const editarCategoria = async (datos) => {
    categoria.value = datos;
    visible_categoria.value = true;
}

</script>

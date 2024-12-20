<template>
    <Toolbar class="mb-6">
        <template #start>
            <!--<Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="nuevoDetalle de detalleproducto()" />-->
            <Button label="Nuevo Detalle de producto" icon="pi pi-plus" class="mr-2" @click="nuevoDetalleProduct()" />
        </template>

        <template #end>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" customUpload
                chooseLabel="Importar" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
            <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
    </Toolbar>

    <DataTable ref="dt" :value="detalleproducts" dataKey="id" lazy :totalRecords="totalRecords" :loading="loading"
        tableStyle="min-width: 100rem; font-size: 0.85rem;" :paginator="true" :rows="10" @page="onPage($event)"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[3, 10, 25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Detalle de Equipo"
        class="p-datatable-sm" scrollable>
        <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
                <h4 class="m-0">Gestión Detalle de Equipo</h4>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Buscar..." v-model="buscar" @change="getDetalleProduct()" />
                </IconField>
            </div>
        </template>

        <Column header="NOMBRE EQUIPO" sortable style="min-width: 6rem">
            <template #body="slotProps">
                <div class="flex flex-col">
                    <span class="text-gray-700 font-semibold">
                        {{ slotProps.data.producto.categoria?.nombre || 'Sin Categoría' }}
                    </span>
                    <span class="text-gray-500">
                        {{ slotProps.data.producto?.nombre || 'Sin Nombre' }}
                    </span>
                </div>
            </template>
        </Column>
        <Column field="codigo" header="CODIGO EQUIPO" sortable style="min-width: 6rem"></Column>
        <Column field="serie" header="SERIE" sortable style="min-width: 12rem"></Column>
        <Column field="mac" header="MAC" sortable style="min-width: 16rem"></Column>
        <Column header="ESTADO PRESTAMO" sortable style="min-width: 14rem">
            <template #body="slotProps">
                <span :class="{
                    'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs': slotProps.data.estado_prestamo === 'DISPONIBLE',
                    'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs': slotProps.data.estado_prestamo === 'PRESTADO',
                    'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs': slotProps.data.estado_prestamo === 'DEVUELTO',
                    'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs': slotProps.data.estado_prestamo === 'EN REVISION',
                }">
                    <i :class="{
                        'pi pi-check-circle': slotProps.data.estado_prestamo === 'DISPONIBLE',
                        'pi pi-refresh': slotProps.data.estado_prestamo === 'PRESTADO',
                        'pi pi-undo': slotProps.data.estado_prestamo === 'DEVUELTO',
                        'pi pi-exclamation-triangle': slotProps.data.estado_prestamo === 'EN REVISION',
                    }"></i>
                    {{ slotProps.data.estado_prestamo }}
                </span>
            </template>
        </Column>
        <Column header="ESTADO FISICO" sortable style="min-width: 14rem">
            <template #body="slotProps">
                <span :class="{
                    'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs': slotProps.data.estado_fisico === 'OPERATIVO',
                    'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs': slotProps.data.estado_fisico === 'DAÑADO',
                    'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs': slotProps.data.estado_fisico === 'EN REPARACION',
                }">
                    {{ slotProps.data.estado_fisico }}
                </span>
            </template>
        </Column>
        <Column field="observaciones" header="OBSERVACIONES" sortable style="min-width: 14rem"></Column>

        <Column header="FECHA REGISTRO" sortable style="min-width: 5rem">
            <template #body="slotProps">
                {{ formatDate(slotProps.data.created_at) }}
            </template>
        </Column>

        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editDetalleProduct(slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger"
                    @click="confirmDeletedetalleproduct(slotProps.data)" />
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="detalleProductDialog" :style="{ width: '450px' }" header="Detalle del Equipo" :modal="true"
        @hide="resetForm">

        <div class="flex flex-col gap-2">
            <img v-if="detalleproduct.image"
                :src="`https://primefaces.org/cdn/primevue/images/detalleproduct/${detalleproduct.image}`"
                :alt="detalleproduct.image" class="block m-auto pb-4" />

            <div>

                <span class="block font-bold mb-4">Nombre del Equipo</span>
                <Select v-model="detalleproduct.producto_id" :options="productos" optionLabel="nombre"
                    :invalid="submitted && !detalleproduct.producto_id" fluid
                    :class="{ 'p-invalid': errores.producto_id }" optionValue="id" placeholder="Seleccione el equipo"
                    class="w-full md:w-70" />
                <small v-if="submitted && !detalleproduct.producto_id" class=" text-red-500">El nombre del equipo es
                    obligatorio</small>
                <small v-if="errores.producto_id" class="p-error text-red-500">{{ errores.producto_id[0] }}
                </small>
            </div>
            <div>
                <label for="codigo" class="block font-bold mb-3">Codigo</label>
                <InputText id="codigo" v-model.trim="detalleproduct.codigo" required="true" autofocus
                    :invalid="submitted && !detalleproduct.codigo" fluid :class="{ 'p-invalid': errores.codigo }" />
                <small v-if="submitted && !detalleproduct.codigo" class="text-red-500">El codigo del equipo es
                    obligatorio</small>
                <small v-if="errores.codigo" class="p-error text-red-500">{{ errores.codigo[0] }}

                </small>
            </div>
            <div>
                <label for="serie" class="block font-bold mb-3">Numero de Serie</label>
                <InputText id="serie" v-model.trim="detalleproduct.serie" required="true" autofocus />
                <small v-if="errores.serie" class="p-error text-red-500">{{ errores.serie[0] }} </small>

            </div>
            <div>
                <label for="mac" class="block font-bold mb-3">Numero de Mac</label>
                <InputText id="mac" v-model.trim="detalleproduct.mac" required="true" autofocus />
                <small v-if="errores.mac" class="p-error text-red-500">{{ errores.mac[0] }}
                </small>
            </div>


            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-6">
                    <label for="estado_prestamo" class="block font-bold mb-3">Estado Prestamo</label>


                    <Dropdown id="estado_prestamo" v-model="detalleproduct.estado_prestamo" :options="estado_prestamo"
                        option-label="label" option-value="value" placeholder="Seleccione estado de prestamo"
                        class="w-full" />
                </div>


            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-6">
                    <label for="estado_fisico" class="block font-bold mb-3">Estado Fisico del Equipo</label>


                    <Dropdown id="estado_fisico" v-model="detalleproduct.estado_fisico" :options="estado_fisico"
                        option-label="label" option-value="value" placeholder="Seleccione estado fisico del equipo"
                        class="w-full" />
                </div>


            </div>

            <div>
                <label for="description" class="block font-bold mb-3">Descripción</label>
                <Textarea id="description" v-model="detalleproduct.descripcion" required="true" rows="2" cols="10"
                    fluid />
            </div>

        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="resetForm" />
            <Button label="Guardar" icon="pi pi-check" @click="guardardetalleproduct()" />
        </template>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import detalleProductService from "./../../../services/producto_detalle.service"
import productoService from "./../../../services/producto.service"
import { useToast } from "primevue/usetoast";
import Swal from 'sweetalert2'


const detalleproducts = ref([]);
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});
const buscar = ref("")
const detalleProductDialog = ref(false);
const submitted = ref(false);
const detalleproduct = ref({})
const productos = ref([])
const errores = ref({}); // Objeto para almacenar errores del backend
const toast = useToast();
const dt = ref();



onMounted(() => {
    loading.value = true;

    lazyParams.value = {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
    };

    getDetalleProduct()
    getProductos()
})

watch(detalleproduct, (nuevoDetalleProduct) => {
    // Limpia los errores al corregir el campo
    if (nuevoDetalleProduct.codigo) errores.value.codigo = null;
    if (nuevoDetalleProduct.serie) errores.value.serie = null;
    if (nuevoDetalleProduct.mac) errores.value.mac = null;
    if (nuevoDetalleProduct.producto_id) errores.value.producto_id = null;
}, { deep: true });


const exportCSV = () => {
    dt.value.exportCSV();
};

const formatDate = (date) => {
    if (!date) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
};

const estado_prestamo = [
    { label: "DISPONIBLE", value: "DISPONIBLE" },
    { label: "PRESTADO", value: "PRESTADO" },
    { label: "DEVUELTO", value: "DEVUELTO" },
    { label: "EN REVISION", value: "EN REVISION" }
];

const estado_fisico = [
    { label: "OPERATIVO", value: "OPERATIVO" },
    { label: "DAÑADO", value: "DAÑADO" },
    { label: "EN REPARACION", value: "EN REPARACION" },
];


const getDetalleProduct = async () => {
    loading.value = true;
    const { data } = await detalleProductService.listar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);

    detalleproducts.value = data.data;
    totalRecords.value = data.total;

    loading.value = false;
}

const getProductos = async () => {
    const { data } = await productoService.listar();

    productos.value = data.data.filter(producto => producto.tipo === "individual");
}

const onPage = (event) => {
    lazyParams.value = event;
    getDetalleProduct(event);
};


const nuevoDetalleProduct = () => {
    detalleproduct.value = {};
    submitted.value = false;
    detalleProductDialog.value = true;
}




const guardardetalleproduct = async () => {
    submitted.value = true;
    if (detalleproduct?.value.codigo?.trim()) {
        try {

            if (detalleproduct.value.id) {//EDITAR

                await detalleProductService.modificar(detalleproduct.value.id, detalleproduct.value);
                toast.add({ severity: 'success', summary: 'Equipo actualizado correctamente', life: 3000 });

            }
            else {//AGREGAR
                await detalleProductService.guardar(detalleproduct.value);
                toast.add({ severity: 'success', summary: 'Equipo agregado correctamente', life: 3000 });
            }
            getDetalleProduct();
            detalleProductDialog.value = false
            detalleproduct.value = {};
        } catch (error) {
            if (error.response && error.response.data.errors) {
                errores.value = error.response.data.errors; // Captura los errores del backend
            }
        }
    }

}
const editDetalleProduct = (datos) => {
    detalleproduct.value = datos;
    detalleProductDialog.value = true;
}

const confirmDeletedetalleproduct = async (detalleproduct) => {
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
            await detalleProductService.eliminar(detalleproduct.id); // Llamada al servicio para eliminar

            await Swal.fire({
                title: "¡Eliminado!",
                text: "El Equipo ha sido eliminada correctamente.",
                icon: "success",
            });
            await getDetalleProduct();
        }
    } catch (error) {
        console.error("Error al eliminar el Equipo:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un problema al intentar eliminar el Equipo.",
            icon: "error",
        });
    }
};

const resetForm = () => {
    submitted.value = false; // Reinicia la validación del frontend
    errores.value = {};       // Limpia los errores del backend
    detalleproduct.value = {};    // Reinicia el modelo de la categoría
    detalleProductDialog.value = false; // Cierra el modal
};



</script>
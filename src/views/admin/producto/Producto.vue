<template>
    <Toolbar class="mb-6">
        <template #start>
            <!--<Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="nuevoProducto()" />-->
            <Button label="Nuevo Producto" icon="pi pi-plus" class="mr-2" @click="nuevoProductoConImagen()" />
        </template>

        <template #end>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" customUpload
                chooseLabel="Importar" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
            <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
    </Toolbar>

    <DataTable ref="dt" :value="products" dataKey="id" lazy :totalRecords="totalRecords" :loading="loading"
        tableStyle="min-width: 100rem; font-size: 0.85rem;" :paginator="true" :rows="10" @page="onPage($event)"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[3, 10, 25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" class="p-datatable-sm"
        scrollable>
        <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
                <h4 class="m-0">Gestión Productos</h4>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText placeholder="Buscar..." v-model="buscar" @change="getProductos()" />
                </IconField>
            </div>
        </template>

        <!-- <Column field="id" header="ID" sortable style="min-width: 3rem"></Column>-->
        <Column header="IMAGEN">
            <template #body="slotProps">
                <Image :src="getImageUrl(slotProps.data.imagen)" alt="Imagen del producto"
                    style="width: 60px; height: 60px; object-fit: cover;" preview />
            </template>
        </Column>
        <Column field="categoria.nombre" header="CATEGORIA" sortable style="min-width: 6rem"></Column>
        <Column field="nombre" header="NOMBRE" sortable style="min-width: 12rem"></Column>
        <Column field="descripcion" header="DESCRIPCION" sortable style="min-width: 16rem"></Column>
        <Column field="unidad_medida" header="UNIDAD MEDIDA" sortable style="min-width: 14rem">
            <template #body="slotProps">
                <span v-if="slotProps.data.unidad_medida === 'unidad'"
                    class="flex items-center px-2 py-1 rounded-lg text-white"
                    :style="{ backgroundColor: '#ffcccb', color: '#800000' }">
                    <i class="pi pi-tag mr-2"></i> Unidad
                </span>
                <span v-else-if="slotProps.data.unidad_medida === 'rollo'"
                    class="flex items-center px-2 py-1 rounded-lg text-white"
                    :style="{ backgroundColor: '#d4edda', color: '#155724' }">
                    <i class="pi pi-circle mr-2"></i> Rollo
                </span>
                <span v-else-if="slotProps.data.unidad_medida === 'caja'"
                    class="flex items-center px-2 py-1 rounded-lg text-white"
                    :style="{ backgroundColor: '#cce5ff', color: '#004085' }">
                    <i class="pi pi-box mr-2"></i> Caja
                </span>
                <span v-else-if="slotProps.data.unidad_medida === 'metro'"
                    class="flex items-center px-2 py-1 rounded-lg text-white"
                    :style="{ backgroundColor: '#fff3cd', color: '#856404' }">
                    <i class="pi pi-arrows-h mr-2"></i> Metro
                </span>
                <span v-else-if="slotProps.data.unidad_medida === 'paquete'"
                    class="flex items-center px-2 py-1 rounded-lg text-white"
                    :style="{ backgroundColor: '#f2f2f2', color: '#333333' }">
                    <i class="pi pi-tags mr-2"></i> Paquete
                </span>
            </template>
        </Column>

        <Column field="stock" header="STOCK" sortable style="min-width: 10rem">
            <template #body="slotProps">
                <span class="px-2 py-1 rounded-lg text-white" :style="{ backgroundColor: '#d4edda', color: '#155724' }">
                    {{ slotProps.data.stock }}
                </span>
            </template>
        </Column>
        <Column field="tipo" header="TIPO" sortable style="min-width: 14rem">
            <template #body="slotProps">
                <span v-if="slotProps.data.tipo === 'individual'"
                    class="flex items-center px-2 py-1 rounded-lg text-white"
                    :style="{ backgroundColor: '#cce5ff', color: '#004085' }">
                    <i class="pi pi-tag mr-2"></i> <!-- Ícono para individual -->
                    Individual
                </span>
                <span v-else-if="slotProps.data.tipo === 'general'"
                    class="flex items-center px-2 py-1 rounded-lg text-white"
                    :style="{ backgroundColor: '#e2e3e5', color: '#383d41' }">
                    <i class="pi pi-box mr-2"></i> <!-- Ícono para general -->
                    General
                </span>
            </template>
        </Column>
        <Column field="precio_compra" header="PRECIO COMPRA" sortable style="min-width: 5rem">
            <template #body="slotProps">
                {{ formatCurrency(slotProps.data.precio_compra) }}
            </template>
        </Column>
        <Column field="precio_venta" header="PRECIO VENTA" sortable style="min-width: 5rem">
            <template #body="slotProps">
                {{ formatCurrency(slotProps.data.precio_venta) }}
            </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger"
                    @click="confirmDeleteProduct(slotProps.data)" />
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="productDialog2" :style="{ width: '450px' }" header="Producto" :modal="true"
        @hide="resetForm">

        <div class="flex flex-col gap-2">
            <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
                :alt="product.image" class="block m-auto pb-4" />

            <div>

                <span class="block font-bold mb-4">Categoria</span>
                <Select v-model="product.categoria_id" :options="categorias" optionLabel="nombre"
                    :invalid="submitted && !product.categoria_id" fluid :class="{ 'p-invalid': errores.categoria_id }"
                    optionValue="id" placeholder="Seleccionar una categoria" class="w-full md:w-70" />
                <small v-if="submitted && !product.categoria_id" class=" text-red-500">El nombre de la categoria es
                    obligatorio</small>
                <small v-if="errores.categoria_id" class="p-error text-red-500">{{ errores.categoria_id[0] }}
                </small>
            </div>
            <div>
                <label for="name" class="block font-bold mb-3">Nombre</label>
                <InputText id="name" v-model.trim="product.nombre" required="true" autofocus
                    :invalid="submitted && !product.nombre" fluid :class="{ 'p-invalid': errores.nombre }" />
                <small v-if="submitted && !product.nombre" class="text-red-500">El nombre del producto es
                    obligatorio</small>
                <small v-if="errores.nombre" class="p-error text-red-500">{{ errores.nombre[0] }}
                </small>
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Descripción</label>
                <Textarea id="description" v-model="product.descripcion" required="true" rows="2" cols="10" fluid />
            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-6">
                    <label for="price_compra" class="block font-bold mb-3">Precio Compra</label>
                    <InputNumber id="price" v-model="product.precio_compra" mode="currency" currency="PEN"
                        locale="es-PE" fluid />
                </div>
                <div class="col-span-6">
                    <label for="price_venta" class="block font-bold mb-3">Precio Venta</label>
                    <InputNumber id="price" v-model="product.precio_venta" mode="currency" currency="PEN" locale="es-PE"
                        fluid />
                </div>

            </div>
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-6">
                    <label for="unidad_medida" class="block font-bold mb-3">Unidad Medida</label>


                    <Dropdown id="unidad_medida" v-model="product.unidad_medida" :options="unidad_medida"
                        option-label="label" option-value="value" placeholder="Seleccione la unidad de medida"
                        class="w-full" />
                </div>
                <div class="col-span-6">
                    <label for="cantidad_medida" class="block font-bold mb-3">Cantidad Medida</label>
                    <InputNumber id="cantidad_medida" v-model="product.cantidad_medida" fluid />
                </div>

            </div>
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-6">
                    <label for="quantity" class="block font-bold mb-3">Stock</label>
                    <InputNumber v-model="product.stock" integeronly fluid />
                </div>
                <div class="col-span-6">
                    <div class="field col-12">
                        <label for="tipo" class="block font-bold mb-3">Tipo Producto</label>
                        <Dropdown v-model="product.tipo" :options="tipo_producto" option-label="label"
                            option-value="value" placeholder="Selecciona el tipo de producto" id="cargo"
                            class="w-full" />
                        <!--- <small v-if="errores.tipo" class="p-error text-red-500">{{ errores.tipo[0] }} </small>-->
                    </div>
                </div>


            </div>
            <div>
                <span class="block font-bold mb-4">Imagen</span>
                <div class="grid grid-cols-12 gap-4">
                    <div class="flex items-center gap-2 col-span-6">
                        <!-- Input para seleccionar la imagen -->
                        <input type="file" @change="seleccionarImagen($event)" accept="image/*">
                    </div>
                    <div v-if="imagenPreview" class="col-span-6">
                        <!-- Previsualización de la imagen -->
                        <img :src="imagenPreview" alt="Previsualización" ref="fileInputRef"
                            class="w-32 h-32 object-cover rounded-md border">
                    </div>

                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancelar" icon="pi pi-times" @click="resetForm" />
            <Button label="Guardar" icon="pi pi-check" @click="guardarProductoConImagen()" />
        </template>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import productoService from "./../../../services/producto.service"
import categoriaService from "./../../../services/categoria.service"
import { useToast } from "primevue/usetoast";
import Swal from 'sweetalert2'


const products = ref([]);
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({});
const buscar = ref("")
const productDialog = ref(false);
const submitted = ref(false);
const product = ref({})
const categorias = ref([])
const productDialog2 = ref(false)
const imagenPreview = ref(null); // Estado para la previsualización
const errores = ref({}); // Objeto para almacenar errores del backend
const toast = useToast();
const dt = ref();
const defaultImage = "http://127.0.0.1:8000/storage/imagenes/sin-imagen.png";
const fileInputRef = ref(null);

onMounted(() => {
    loading.value = true;

    lazyParams.value = {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null,
    };

    getProductos()
    getCategorias()
})

watch(product, (nuevoProducto) => {
    // Limpia los errores al corregir el campo
    if (nuevoProducto.nombre) errores.value.nombre = null;
    if (nuevoProducto.id_categoria) errores.value.id_categoria = null;
}, { deep: true });


const exportCSV = () => {
    dt.value.exportCSV();
};

const unidad_medida = [
    { label: "unidad", value: "unidad" },
    { label: "rollo", value: "rollo" },
    { label: "caja", value: "caja" },
    { label: "metro", value: "metro" },
    { label: "paquete", value: "paquete" },
];


const tipo_producto = [
    { label: "General", value: "general" },
    { label: "Individual", value: "individual" }
];

const formatCurrency = (value) => {
    if (value) {
        return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
    }
    return "S/ 0.00";
};

const getImageUrl = (imagen) => {
    return imagen ? `http://127.0.0.1:8000/${imagen}` : defaultImage;
};

const getProductos = async () => {
    loading.value = true;
    console.log(lazyParams.value);
    const { data } = await productoService.listar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);

    products.value = data.data;
    totalRecords.value = data.total;

    loading.value = false
}

const getCategorias = async () => {
    const { data } = await categoriaService.listarCategoria();

    categorias.value = data;
}

const onPage = (event) => {
    lazyParams.value = event;
    getProductos(event);
};


const nuevoProductoConImagen = () => {
    product.value = {};
    submitted.value = false;
    productDialog2.value = true;
}
/*
const guardarProducto = async () => {

    submitted.value = true;

    if (product?.value.nombre?.trim()) {
        try {
            await productoService.guardar(product.value);
            productDialog.value = false
            getProductos();

        } catch (error) {
            console.log("ERROR: ", error);
        }
    }

}
/*


/*
const seleccionarImagen = (event) => {
    console.log(event.target.files[0]);
    product.value.imagen = event.target.files[0]
}*/
const seleccionarImagen = (event) => {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {

        if (imagenPreview.value) {
            URL.revokeObjectURL(imagenPreview.value);
        }
        // Crear una URL temporal para la previsualización
        imagenPreview.value = URL.createObjectURL(file);
        product.value.imagen = file; // Guardar el archivo en el producto
    }
};

const guardarProductoConImagen = async () => {
    submitted.value = true;

    if (product?.value.nombre?.trim()) {
        try {
            const formdata = new FormData();
            formdata.append("nombre", product.value.nombre);
            formdata.append("descripcion", product.value.descripcion || "");
            formdata.append("precio_compra", product.value.precio_compra || 0);
            formdata.append("precio_venta", product.value.precio_venta || 0);
            formdata.append("unidad_medida", product.value.unidad_medida);
            formdata.append("tipo", product.value.tipo);
            formdata.append("cantidad_medida", product.value.cantidad_medida || 1);
            formdata.append("stock", product.value.stock || 0);
            formdata.append("imagen", product.value.imagen || null);
            formdata.append("categoria_id", product.value.categoria_id);
            if (product.value.id) {
                formdata.append("_method", "PUT");
                await productoService.modificar(product.value.id, formdata);
                toast.add({ severity: 'success', summary: 'Producto actualizado correctamente', life: 3000 });


            } else {
                await productoService.guardarConImagen(formdata);
                toast.add({ severity: 'success', summary: 'Producto agregado correctamente', life: 3000 });
            }
            getProductos();
            productDialog2.value = false
            product.value = {};

        } catch (error) {
            if (error.response && error.response.data.errors) {
                errores.value = error.response.data.errors; // Captura los errores del backend
            }

        }
    }
}
const editProduct = (datos) => {
    product.value = datos;
    productDialog2.value = true;
}

const confirmDeleteProduct = async (producto) => {
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
            await productoService.eliminar(producto.id); // Llamada al servicio para eliminar

            await Swal.fire({
                title: "¡Eliminado!",
                text: "El producto ha sido eliminada correctamente.",
                icon: "success",
            });
            await getProductos();
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un problema al intentar eliminar el producto.",
            icon: "error",
        });
    }
};

const resetForm = () => {
    submitted.value = false; // Reinicia la validación del frontend
    errores.value = {};       // Limpia los errores del backend
    product.value = {};    // Reinicia el modelo de la categoría
    productDialog2.value = false; // Cierra el modal
    // Reinicia el campo de archivo (imagen)
    if (imagenPreview.value) {
        URL.revokeObjectURL(imagenPreview.value);
        imagenPreview.value = null; // Reinicia la previsualización
    }
    if (fileInputRef.value) {
        fileInputRef.value.value = null; // Esto limpia el valor del input file
    }
};



</script>
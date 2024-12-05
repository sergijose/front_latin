<template>
    <Toolbar class="mb-6">
        <template #start>
            <Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="nuevoProducto()" />
            <Button label="Nuevo Producto + Imagen" icon="pi pi-plus" class="mr-2" @click="nuevoProductoConImagen()" />
        </template>

        <template #end>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" customUpload chooseLabel="Importar" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
            <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
        </template>
    </Toolbar>

    <DataTable
    ref="dt"
    :value="products"
    dataKey="id"
    lazy
    :totalRecords="totalRecords"
    :loading="loading"
    :paginator="true"
    :rows="10"
    @page="onPage($event)"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[3, 10, 25]"
    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
>
    <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">Gestión Productos</h4>
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText  placeholder="Buscar..." v-model="buscar" @change="getProductos()" />
            </IconField>
        </div>
    </template>

    <Column field="id" header="ID" sortable style="min-width: 3rem"></Column>
    <Column field="nombre" header="NOMBRE" sortable style="min-width: 16rem"></Column>
    <Column header="Image">
        <template #body="slotProps">
            <Image :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`" alt="slotProps.data.imagen" width="80" preview />
        </template>
    </Column>
    <Column field="precio" header="PRECIO" sortable style="min-width: 5rem">
        <template #body="slotProps">
            {{ formatCurrency(slotProps.data.precio) }}
        </template>
    </Column>
    <Column field="categoria.nombre" header="Categoria" sortable style="min-width: 6rem"></Column>
  
    <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
        </template>
    </Column>
</DataTable>

<Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detalle Producto" :modal="true">
    {{ product }}
            <div class="flex flex-col gap-6">
                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model.trim="product.nombre" required="true" autofocus :invalid="submitted && !product.nombre" fluid />
                    <small v-if="submitted && !product.nombre" class="text-red-500">El nombre es Oblogatorio.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="product.descripcion" required="true" rows="3" cols="20" fluid />
                </div>

                <div>
                    <span class="block font-bold mb-4">Categoria</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6" v-for="cat in categorias" :key="cat">
                            <RadioButton id="category1" v-model="product.categoria_id" name="category" :value="cat.id" />
                            <label for="category1">{{cat.nombre}}</label>
                        </div>
                        
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio</label>
                        <InputNumber id="price" v-model="product.precio" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Stock</label>
                        <InputNumber id="quantity" v-model="product.stock" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="guardarProducto" />
            </template>
        </Dialog>

        <Dialog v-model:visible="productDialog2" :style="{ width: '450px' }" header="Detalle Producto" :modal="true">

            <div class="flex flex-col gap-6">
                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model.trim="product.nombre" required="true" autofocus :invalid="submitted && !product.nombre" fluid />
                    <small v-if="submitted && !product.nombre" class="text-red-500">El nombre es Oblogatorio.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="product.descripcion" required="true" rows="3" cols="20" fluid />
                </div>

                <div>
                    {{ product }}
                    <span class="block font-bold mb-4">Categoria</span>
                    <Select v-model="product.categoria_id" :options="categorias" optionLabel="nombre" optionValue="id" placeholder="Seleccionar una categoria" class="w-full md:w-56" />
                    <div class="grid grid-cols-12 gap-4">

                        <div class="flex items-center gap-2 col-span-6" v-for="cat in categorias" :key="cat">
                            <RadioButton id="category1" v-model="product.categoria_id" name="category" :value="cat.id" />
                            <label for="category1">{{cat.nombre}}</label>
                        </div>
                        
                    </div>
                </div>
                <div>
                    <span class="block font-bold mb-4">Imagen</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6" >
                            <input type="file" @change="seleccionarImagen($event)">
                        </div>
                        
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio</label>
                        <InputNumber id="price" v-model="product.precio" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Stock</label>
                        <InputNumber id="quantity" v-model="product.stock" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="guardarProductoConImagen()" />
            </template>
        </Dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import productoService from "./../../../services/producto.service"
import categoriaService from "./../../../services/categoria.service"


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

const dt = ref();


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

const exportCSV = () => {
    dt.value.exportCSV();
};


const formatCurrency = (value) => {
    if(value)
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    return;
};

const getProductos = async () =>{
    loading.value = true;
    console.log(lazyParams.value);
    const {data} = await productoService.listar(lazyParams.value.page+1, lazyParams.value.rows, buscar.value);

    products.value = data.data;
    totalRecords.value = data.total;

    loading.value = false
}

const getCategorias = async () => {
    const {data} = await categoriaService.listar();

    categorias.value = data;
}

const onPage = (event) => {
    lazyParams.value = event;
    getProductos(event);
};

const nuevoProducto = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
}

const nuevoProductoConImagen = () => {
    product.value = {};
    submitted.value = false;
    productDialog2.value = true;
}

const guardarProducto = async () => {

    await productoService.guardar(product.value);
    productDialog.value = false
    getProductos();
}

const seleccionarImagen = (event) => {
    console.log(event.target.files[0]);
    product.value.imagen = event.target.files[0]
}

const guardarProductoConImagen = async () => {

    const formdata = new FormData();
    formdata.append("nombre", product.value.nombre);
    formdata.append("descripcion", product.value.descripcion);
    formdata.append("precio", product.value.precio);
    formdata.append("stock", product.value.stock);
    formdata.append("imagen", product.value.imagen);
    formdata.append("categoria_id", product.value.categoria_id);
    if(product.value.id){

        formdata.append("_method", "PUT");

        await productoService.modificar(product.value.id, formdata);
        productDialog2.value = false
    }else{
        await productoService.guardarConImagen(formdata);
        productDialog2.value = false
    }

    getProductos();
}

const editProduct = (datos) => {
    product.value = datos;
    productDialog2.value = true;
}


</script>
<template>
  <div class="flex">
    <div class="flex-1 bg-sky-200 p-4">
      <DataTable
        ref="dt"
        :value="products"
        dataKey="id"
        lazy
        :totalRecords="totalRecords"
        :loading="loading"
        :paginator="true"
        :rows="3"
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
              <InputText
                placeholder="Buscar..."
                v-model="buscar"
                @change="getProductos()"
              />
            </IconField>
          </div>
        </template>

        <Column
          field="id"
          header="ID"
          sortable
          style="min-width: 2rem"
        ></Column>
        <Column
          field="nombre"
          header="NOMBRE"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column header="Image" style="min-width: 4rem">
          <template #body="slotProps">
            <Image
              :src="`http://127.0.0.1:8000/${slotProps.data.imagen}`"
              alt="slotProps.data.imagen"
              width="80"
              preview
            />
          </template>
        </Column>

        <Column
          field="stock"
          header="STOCK"
          sortable
          style="min-width: 2rem"
        ></Column>

        <Column field="precio" header="PRECIO" sortable style="min-width: 5rem">
          <template #body="slotProps">
            {{ formatCurrency(slotProps.data.precio) }}
          </template>
        </Column>
        <Column
          field="categoria.nombre"
          header="Categoria"
          sortable
          style="min-width: 4rem"
        ></Column>

        <Column :exportable="false" style="min-width: 2rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-plus"
              rounded
              class="mr-2"
              @click="agregarCarrito(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Segunda columna -->
    <div class="flex-1 flex flex-col bg-sky-200 p-4">
      <!-- Primera fila de la segunda columna -->
      <div class="flex-1 bg-blue-400 p-0 mb-2">
        <div class="overflow-x-auto px-2 py-2">
          <table
            class="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md"
          >
            <thead>
              <tr class="bg-gray-200 text-left text-sm">
                <th class="px-2 py-1 border-b">Producto</th>
                <th class="px-2 py-1 border-b">Precio</th>
                <th class="px-2 py-1 border-b">Cantidad</th>
                <th class="px-2 py-1 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b hover:bg-gray-50 text-sm" v-for="prod in carrito" :key="prod.id">
                <td class="px-2 py-1">{{ prod.nombre }}</td>
                <td class="px-2 py-1">{{ prod.precio }}</td>
                <td class="px-2 py-1">{{ prod.cantidad }}</td>
                <td class="px-2 py-1">
                  <button
                    class="bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      <!-- Segunda fila de la segunda columna -->
      <div class="flex-1 bg-blue-100 p-2 mb-2">

        <InputText
                placeholder="Buscar..."
                v-model="buscarCliente"
                @change="getCliente()"
              />

        <Button label="Crear Nuevo Cliente" @click="visible = true" />

<Dialog v-model:visible="visible" modal header="Nuevo Cliente" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Ingrese información relevante del Cliente.</span>
  
    <div class="flex items-center gap-4 mb-4">
        <label for="nc" class="font-semibold w-24">Nombre Completo</label>
        <InputText id="nc" class="flex-auto" autocomplete="off" v-model="cliente.nombre_completo" />
    </div>
    <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Correo</label>
        <InputText id="email" class="flex-auto" autocomplete="off" v-model="cliente.correo" />
    </div>

    <div class="flex items-center gap-4 mb-8">
        <label for="tel" class="font-semibold w-24">Telefono</label>
        <InputText id="tel" class="flex-auto" autocomplete="off" v-model="cliente.telefono"/>
    </div>

    <div class="flex items-center gap-4 mb-8">
        <label for="dir" class="font-semibold w-24">Dirección</label>
        <InputText id="dir" class="flex-auto" autocomplete="off" v-model="cliente.direccion" />
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Guardar Cliente" @click="guardarCliente()"></Button>
    </div>

</Dialog>

<div v-if="cliente_seleccionado.id">
  
  <h2>CLIENTE: {{ cliente_seleccionado.nombre_completo }}</h2>
  <h2>TELEFONO: {{ cliente_seleccionado.telefono }}</h2>
  <h2>CORREO: {{ cliente_seleccionado.correo }}</h2>
  <h2>DIRECCION: {{ cliente_seleccionado.direccion }}</h2>

</div>

      </div>
      <!-- Tercera fila de la segunda columna -->
      <div class="flex-1 bg-blue-100 p-2">
        <Textarea v-model="pedido.observacion" rows="5" cols="30" />
        <br>
                <Button label="Registrar Pedido" @click="guardarPedido()" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import productoService from "./../../../../services/producto.service.js";
import clienteService from "./../../../../services/cliente.service.js";
import pedidoService from "./../../../../services/pedido.service";

const products = ref([]);
const totalRecords = ref(0);
const loading = ref(false);
const lazyParams = ref({});
const buscar = ref("");
const carrito = ref([]);

const visible = ref(false)
const cliente = ref({})
const cliente_seleccionado = ref({});
const buscarCliente = ref("");
const pedido = ref({});

onMounted(() => {
  loading.value = true;

  lazyParams.value = {
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
  };

  getProductos();
});

const getProductos = async () => {
  loading.value = true;
  console.log(lazyParams.value);
  const { data } = await productoService.listar(
    lazyParams.value.page + 1,
    lazyParams.value.rows,
    buscar.value
  );

  products.value = data.data;
  totalRecords.value = data.total;

  loading.value = false;
};

const formatCurrency = (value) => {
  if (value)
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  return;
};

const agregarCarrito = (prod) => {

  let prod_carrito = {
    nombre: prod.nombre,
    precio: prod.precio,
    id: prod.id,
    cantidad: 1,
  };

  const pos = carrito.value.findIndex(item => item.id == prod_carrito.id);
  if(pos === -1){
    prod.stock--;
    carrito.value.push(prod_carrito);
  }else{
    if(1 <= prod.stock){
      carrito.value[pos].cantidad++;
      prod.stock--;
    }
  }

};

const guardarCliente = async () => {
    try {
        const {data} = await clienteService.store(cliente.value);
        cliente_seleccionado.value = data;

        visible.value = false;
        cliente.value = {}

        
    } catch (error) {
        
    }
}

async function getCliente(){
  try {
        const {data} = await clienteService.buscarCliente(buscarCliente.value);
        cliente_seleccionado.value = data;

        
    } catch (error) {
        
    }
}

const guardarPedido = async () => {

  try {
    
    let detalle = []
    for (const prod of carrito.value) {
      detalle.push({ "producto_id": prod.id, "cantidad": prod.cantidad});
    }
    
    const datos = {
       cliente_id: cliente_seleccionado.value.id,
       observacion: pedido.value.observacion,
       detalle_pedido: detalle
    }
  
    await pedidoService.store(datos);
    cliente_seleccionado.value = {};
    pedido.value = {};
    carrito.value = [];

    alert("Pedido Registrado");
    
  } catch (error) {
    alert("Ocurrió un error al registrar el Pedido");
  }
    
}
</script>

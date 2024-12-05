<template>
    <h1>Lista Pedido</h1>

    <DataTable :value="pedidos" tableStyle="min-width: 50rem">
        <Column field="id" header="ID"></Column>
        <Column field="fecha" header="FECHA"></Column>
        <Column field="cliente.nombre_completo" header="CLIENTE"></Column>
        <Column header="PRODUCTOS">
            <template #body="slotProps">
                <Button label="Mostrar Detalle Pedido" icon="pi pi-external-link" @click="mostrarDetallePedido(slotProps.data)" />

            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" header="Detalle Pedido" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
    
        <h2 class="text-2xl font-semibold text-gray-800">CLIENTE: {{ pedido.cliente?.nombre_completo }}</h2>
        <h2 class="text-2xl font-semibold text-gray-600 mt-2">ATENDIDO POR: {{ pedido.user?.email }}</h2>
        <h2 class="text-2xl font-semibold text-gray-600 mt-2">FECHA PEDIDO: {{ pedido.fecha }}</h2>
        <DataTable :value="pedido?.productos" scrollable scrollHeight="flex" tableStyle="min-width: 50rem">
                        <Column field="id" header="ID"></Column>
                        <Column field="nombre" header="NOMBRE"></Column>
                        <Column field="precio" header="PRECIO"></Column>
                        <Column field="pivot.cantidad" header="CANTIDAD"></Column>
                    </DataTable>
                    <template #footer>
                        <Button label="Cerrar" icon="pi pi-check" @click="dialogVisible = false" />
                    </template>
                </Dialog>

</template>

<script setup>
import { onMounted, ref } from "vue";
import pedidoService from "../../../../services/pedido.service";

const pedidos = ref([]) 
const dialogVisible = ref(false);
const pedido = ref({});

onMounted(() => {
    getPedidos()
});

const getPedidos = async () => {
    const {data} = await pedidoService.index();
    pedidos.value = data.data;
}

const mostrarDetallePedido = (p) => {
    dialogVisible.value = true;
    pedido.value = p;
} 
</script>
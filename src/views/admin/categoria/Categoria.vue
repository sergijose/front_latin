<template>
    <div class="card">


  <h1>Gestión Categorias</h1>

  <Button label="Registrar Nueva Categoria" @click="visible_categoria = true" />

<Dialog v-model:visible="visible_categoria" modal header="Ingrese Datos de Categoria" :style="{ width: '25rem' }">
    
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Categoria.</span>
    <div class="flex items-center gap-4 mb-4">
        <label for="nom" class="font-semibold w-24">Nombre</label>
        <InputText id="nom" class="flex-auto" autocomplete="off" v-model="categoria.nombre" />
        {{errors.nombre}}
    </div>
    <div class="flex items-center gap-4 mb-8">
        <label for="det" class="font-semibold w-24">Detalle</label>
        <InputText id="det" class="flex-auto" autocomplete="off" v-model="categoria.detalle" />
        {{errors.detalle}}
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="visible_categoria = false"></Button>
        <Button type="button" label="Guardar" @click="funGuardarCategoria()"></Button>
    </div>
</Dialog>

  <DataTable :value="categorias" tableStyle="min-width: 50rem">
    <Column field="id" header="id"></Column>
    <Column field="nombre" header="Nombre"></Column>
    <Column field="detalle" header="Detalle"></Column>

    <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" rounded class="mr-2" @click="editarCategoria(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="danger" @click="eliminarCategoria(slotProps.data.id)" />
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

onMounted(() => {
  getCategorias();
});

const getCategorias = async () => {
  const { data } = await categoriaService.listar();
  categorias.value = data;
};

const funGuardarCategoria = async () => {
    try {
        if(categoria.value.id){

            const {data} = await categoriaService.modificar(categoria.value.id, categoria.value)
        
            getCategorias();
            categoria.value = {}

            Swal.fire({
                title: "Categoria Modificado Correctamente",
                text: "Click Para continuar",
                icon: "success"
            });

        }else{
            const {data} = await categoriaService.guardar(categoria.value)
        
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

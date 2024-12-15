<template>
    <Dialog :visible="visible" :modal="true" header="Asignar Usuario" :style="{ width: '500px' }" @hide="closeModal">
        <div class="p-fluid formgrid grid">
            <div>

                <span class="block font-bold mb-4">Seleccione Usuario</span>
                <Select v-model="usuarios.id" editable :options="usuarios" optionLabel="nombre"
                    optionValue="id" placeholder="Seleccionar un usuario" class="w-full md:w-56" />
               
            </div>
        </div>
        {{ usuarios.value }}

        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" text @click="closeModal" />
                <Button label="Guardar" icon="pi pi-check" @click="" class="p-button-primary" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import usuarioService from "./../services/usuario.service"

const props = defineProps({
    visible: Boolean,
    empleadoId: Number,
    onClose: Function,
});

const usuarios = ref([]);
const selectedUser = ref(null);

const getUsuarios = async () => {
    try {
        const { data } = await usuarioService.listar();
    usuarios.value = data;
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
};

const hideModal = () => {
    props.onClose();
};

</script>

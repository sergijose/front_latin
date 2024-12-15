<template>
  <div class="card">
    <h1>Gestión Usuarios</h1>

    <Button label="Nuevo Usuario" @click="visible = true" />

    <ProgressBar mode="indeterminate" style="height: 6px" v-if="cargando"></ProgressBar>
    <Dialog v-model:visible="visible" modal header="Registro de Usuario" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8">Ingrese datos de usuario.</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Nombre</label>
        <InputText id="username" class="flex-auto" autocomplete="off" v-model="usuario.name" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Correo</label>
        <InputText id="email" class="flex-auto" autocomplete="off" v-model="usuario.email" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="pass" class="font-semibold w-24">Contraseña</label>
        <InputText type="password" id="pass" class="flex-auto" v-model="usuario.password" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Guardar Usuario" @click="guardarUsuario()"></Button>
      </div>
    </Dialog>


    <DataTable :value="usuarios" tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="NOMBRE"></Column>
      <Column field="email" header="CORREO"></Column>
      <Column field="empleado.nombre_completo" header="Empleado Asignado">
    <template #body="slotProps">
      <span v-if="slotProps.data.empleado && slotProps.data.empleado.nombre_completo">
        {{ slotProps.data.empleado.nombre_completo }}- {{ slotProps.data.empleado.num_documento }}
      </span>
      <button 
        v-else 
        class="btn btn-primary" 
        @click="registrarUsuario(slotProps.data)"
      >
        Sin Asignar
      </button>
    </template>
  </Column>
      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" rounded class="mr-2" @click="editarUsuario(slotProps.data)" />
          <Button icon="pi pi-trash" rounded severity="danger" @click="eliminarUsuario(slotProps.data.id)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
<script setup>
// importaciones
import { onMounted, ref } from "vue";
import usuarioService from "./../../../services/usuario.service";
// declaracion de variables
const usuarios = ref([]);
const usuario = ref({});
const buscar = ref("");
const visible = ref(false)
const cargando = ref(false)
// ciclo de vida del comopnente
onMounted(() => {
  listaUsuarios();
});
// metodos
const listaUsuarios = async () => {
  try {
    cargando.value = true
    const { data } = await usuarioService.listar();

    usuarios.value = data;

    cargando.value = false
  } catch (error) {
    console.log(error);
    // alert("Error al recuperar los datos de usuarios");
  }
};

const guardarUsuario = async () => {
  try {
    if (usuario.value.id) {
      // modificar
      await usuarioService.modificar(usuario.value.id, usuario.value);
    } else {
      await usuarioService.guardar(usuario.value);
    }
    usuario.value = {};
    listaUsuarios();

    visible.value = false;
  } catch (error) {
    alert("Error al registrar el usuario");
  }
};

const editarUsuario = (data) => {
  usuario.value = data;

  visible.value = true
};

const buscarUsuarios = async () => {
  const { data } = await usuarioService.listar(buscar.value);
  usuarios.value = data;
};

const eliminarUsuario = async (id) => {
  if (confirm("Está seguro de eliminar al usuario?")) {
    const { data } = await usuarioService.eliminar(id);
    listaUsuarios();
  }
};
</script>

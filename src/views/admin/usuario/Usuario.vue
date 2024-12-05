<template>
  <div class="card">
    <h1>Gestión Usuarios</h1>
    <form @submit.prevent="guardarUsuario">
      <label for="n">Ingrese Nombre:</label>
      <input type="text" id="n" v-model="usuario.name" />
      <br />
      <label for="c">Ingrese Correo:</label>
      <input type="email" id="c" v-model="usuario.email" />
      <br />
      <label for="cc">Ingrese Contraseña:</label>
      <input type="password" id="cc" v-model="usuario.password" />
      <br />
      <input
        type="submit"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      />
    </form>

    <input
      type="text"
      @keyup.enter="buscarUsuarios"
      v-model="buscar"
      placeholder="buscar..."
    />
    <table class="min-w-full table-auto border-collapse">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left fond-semibold text-gray-700">ID</th>
          <th class="px-4 py-2 text-left fond-semibold text-gray-700">
            NOMBRE
          </th>
          <th class="px-4 py-2 text-left fond-semibold text-gray-700">
            CORREO
          </th>
          <th class="px-4 py-2 text-left fond-semibold text-gray-700">
            DATOS PERSONALES
          </th>
          <th class="px-4 py-2 text-left fond-semibold text-gray-700">
            ACCIONES
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="usuario in usuarios"
          :key="usuario.id"
          class="border-t hover:bg-gray-50"
        >
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.name }}</td>
          <td>{{ usuario.email }}</td>
          <td>
            <div v-if="usuario.persona">
              {{ usuario.persona?.nombre_completo }} -
              {{ usuario.persona?.apellidos }}
            </div>
            <div v-else>
              <button>Datos Personales</button>
            </div>
          </td>
          <td>
            <button
              @click="editarUsuario(usuario)"
              class="m-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
            <button
              @click="eliminarUsuario(usuario.id)"
              class="m-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>



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
        <Column field="persona.nombre_completo" header="DATOS PERSONALES"></Column>
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

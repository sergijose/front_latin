<template>
  <Toolbar class="mb-6">
    <template #start>
      <!--<Button label="Nuevo" icon="pi pi-plus" class="mr-2" @click="nuevoProducto()" />-->
      <Button label="Nuevo Empleado" icon="pi pi-plus" class="mr-2" @click="nuevoEmpleado()" />
    </template>

    <template #end>
      <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" customUpload
        chooseLabel="Importar" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
      <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
    </template>
  </Toolbar>



  <div class="card">
    <DataTable ref="dt" dataKey="id" lazy :totalRecords="totalRecords" :value="empleados" :paginator="true" :rows="10"
      @page="onPage($event)" :loading="loading" selection-mode="single" @row-select="onRowSelect"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[3, 10, 25]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} empleados">

      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="m-0">Gestión Empleados</h4>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText placeholder="Buscar..." v-model="buscar" @change="getEmpleados()" />
          </IconField>
        </div>
      </template>
      <Column field="nombre_completo" header="Nombre Completo" sortable />
      <Column field="num_documento" header="Documento" sortable />
      <Column field="correo" header="Correo" />
      <Column field="cargo" header="Cargo" sortable />
      <Column field="estado" header="Estado" />
      <Column field="usuario.name" header="Usuario Asignado">
    <template #body="slotProps">
      <span v-if="slotProps.data.usuario && slotProps.data.usuario.name">
        {{ slotProps.data.usuario.name }}
      </span>
      <button 
        v-else 
        class="btn btn-primary" 
        @click="registrarUsuario(slotProps.data)"
      >
        Registrar Usuario
      </button>
    </template>
  </Column>
      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editarEmpleado(slotProps.data)" />
          <Button icon="pi pi-trash" outlined rounded severity="danger" @click="eliminarEmpleado(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- Modal para crear/editar empleado -->
  <Dialog v-model:visible="empleadoDialog" :modal="true" header="Datos Empleado" :style="{ width: '500px' }"
    @hide="resetForm">
    <div class="p-fluid formgrid grid">
      <div class="field col-12">
        <label for="nombre_completo">Nombre Completo</label>
        <InputText v-model.trim="empleado.nombre_completo" required id="nombre_completo" class="w-full" autofocus
          :invalid="submitted && !empleado.nombre_completo" fluid :class="{ 'p-invalid': errores.nombre_completo }" />
        <small v-if="submitted && !empleado.nombre_completo" class="text-red-500">El nombre del empleado es
          obligatorio</small>
        <small v-if="errores.nombre_completo" class="p-error text-red-500">{{ errores.nombre_completo[0] }} </small>

      </div>

      <div class="field col-12">
        <label for="num_documento">Número de Documento</label>
        <InputText v-model="empleado.num_documento" required id="num_documento" class="w-full"
          :class="{ 'p-invalid': errores.num_documento }" />
        <small v-if="errores.num_documento" class="p-error text-red-500">{{ errores.num_documento[0] }} </small>
      </div>

      <div class="field col-12">
        <label for="correo">Correo Electrónico</label>
        <InputText v-model="empleado.correo" required type="email" id="correo" class="w-full"
          :class="{ 'p-invalid': errores.correo }" />
        <small v-if="errores.correo" class="p-error text-red-500">{{ errores.correo[0] }} </small>
      </div>

      <div class="field col-12">
        <label for="direccion_domicilio">Dirección</label>
        <InputText v-model="empleado.direccion_domicilio" id="direccion_domicilio" class="w-full" />
      </div>

      <div class="field col-12">
        <label for="cargo">Cargo</label>
        <Dropdown v-model="empleado.cargo" :options="cargos" option-label="label" option-value="value"
          placeholder="Selecciona un cargo" id="cargo" class="w-full" :class="{ 'p-invalid': errores.cargo }" />
        <small v-if="errores.cargo" class="p-error text-red-500">{{ errores.cargo[0] }} </small>
      </div>

      <div class="field col-12">
        <label for="estado">Estado</label>
        <Dropdown v-model="empleado.estado" :options="estados" option-label="label" option-value="value"
          placeholder="Selecciona un estado" id="estado" class="w-full" :class="{ 'p-invalid': errores.estado }" />
        <small v-if="errores.estado" class="p-error text-red-500">{{ errores.estado[0] }} </small>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-content-end gap-2">
        <Button label="Cancelar" icon="pi pi-times" text @click="resetForm" class="p-button-text" />
        <Button label="Guardar" icon="pi pi-check" @click="guardarEmpleado" class="p-button-primary" />
      </div>
    </template>
  </Dialog>

</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import empleadoService from "./../../../services/empleado.service";
import { DataTable, Column, Dialog, InputText, Button, Dropdown } from "primevue";
import { useToast } from "primevue/usetoast";
import Swal from 'sweetalert2'

const empleados = ref([]);
const empleado = ref({})
const loading = ref(false);
const totalRecords = ref(0)
const buscar = ref("")
const submitted = ref(false);
const empleadoDialog = ref(false);
const lazyParams = ref({});
const toast = useToast();
const dt = ref();
const errores = ref({}); // Objeto para almacenar errores del backend
onMounted(() => {
  loading.value = true;

  lazyParams.value = {
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
  };
  getEmpleados()
})

watch(empleado, (nuevoEmpleado) => {
  // Limpia los errores al corregir el campo
  if (nuevoEmpleado.nombre_completo) errores.value.nombre_completo = null;
  if (nuevoEmpleado.num_documento) errores.value.num_documento = null;
  if (nuevoEmpleado.estado) errores.value.estado = null;
  if (nuevoEmpleado.cargo) errores.value.cargo = null;
  if (nuevoEmpleado.correo) errores.value.correo = null;
}, { deep: true });

const cargos = [
  { label: "Técnico", value: "tecnico" },
  { label: "Soporte Técnico", value: "soporte_tecnico" },
  { label: "Dirigidor", value: "dirigidor" },
  { label: "Planta Externa", value: "planta_externa" },
  { label: "Vendedor", value: "vendedor" },
];

const estados = [
  { label: "Activo", value: "activo" },
  { label: "Inactivo", value: "inactivo" },
];

const getEmpleados = async () => {
  loading.value = true;
  try {
    const { data } = await empleadoService.listar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value);
    console.log(data);
    empleados.value = data.data;
    totalRecords.value = data.total;
    // loading.value = false
  } catch (error) {
    console.error("Error al cargar empleados:", error);
  } finally {
    loading.value = false;
  }
};
const nuevoEmpleado = () => {
  empleado.value = {};
  submitted.value = false;
  empleadoDialog.value = true;
}
const editarEmpleado = (datos) => {
  empleado.value = datos;
  empleadoDialog.value = true;
}

const onPage = (event) => {
  lazyParams.value = event;
  getEmpleados(event);
};

const guardarEmpleado = async () => {

  submitted.value = true;

  if (empleado?.value.nombre_completo?.trim()) {
    try {

      if (empleado.value.id) {//EDITAR

        await empleadoService.modificar(empleado.value.id, empleado.value);
        toast.add({ severity: 'success', summary: 'Empleado actualizado correctamente', life: 3000 });

      }
      else {//AGREGAR
        await empleadoService.guardar(empleado.value);
        toast.add({ severity: 'success', summary: 'Empleado agregado correctamente', life: 3000 });
      }
      getEmpleados();
      empleadoDialog.value = false
      empleado.value = {};
    } catch (error) {
      if (error.response && error.response.data.errors) {
        errores.value = error.response.data.errors; // Captura los errores del backend
      }
    }
  }
}


const eliminarEmpleado = async (empleado) => {
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
      await empleadoService.eliminar(empleado.id); // Llamada al servicio para eliminar
      await getEmpleados(); // Actualizar la lista de categorías
      await Swal.fire({
        title: "¡Eliminado!",
        text: "El empleado ha sido eliminada correctamente.",
        icon: "success",
      });
    }
  } catch (error) {
    console.error("Error al eliminar el empleado:", error);
    Swal.fire({
      title: "Error",
      text: "Ocurrió un problema al intentar eliminar el empleado.",
      icon: "error",
    });
  }
};

const resetForm = () => {
  submitted.value = false; // Reinicia la validación del frontend
  errores.value = {};       // Limpia los errores del backend
  empleado.value = {};    // Reinicia el modelo de la categoría
  empleadoDialog.value = false; // Cierra el modal
};

</script>
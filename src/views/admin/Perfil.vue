<template>
    <h1>MI PERFIL</h1>
    <InputText type="text" v-model="value" />


    <div v-if="perfil.id">
        <h2>NOMBRE: {{ perfil.name }}</h2>
        <h2>CORREO: {{ perfil.email }}</h2>
        
        <button @click="funSalir()">Salir (Cerrar Sesion)</button>
    </div>

</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import authService from '../../services/auth.service';

    const perfil = ref({})
    const router = useRouter()

    onMounted(() => {
        obtenerPerfil()
    })

    async function obtenerPerfil(){
        const {data} = await authService.profile();
        perfil.value = data;
    }

    async function funSalir(){

        const {data} = await authService.logout()

        localStorage.removeItem("access_token");
        router.push("/auth/login");
    }

</script>
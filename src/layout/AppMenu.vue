<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Admin',
        items: [
            { label: 'Administración', icon: 'pi pi-fw pi-home', to: '/admin' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/perfil' }
        ]
    },
    {
        label: 'Gestión Usuarios',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', to: '/admin/usuario' },
            { label: 'Roles', icon: 'pi pi-fw pi-check-square', to: '/admin/role' },
            { label: 'Empleados', icon: 'pi pi-fw pi-mobile', to: '/admin/empleado', class: 'rotated-icon' },
            
        ]
    },
    {
        label: 'Gestión Inventario',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            { label: 'Categoria', icon: 'pi pi-fw pi-id-card', to: '/admin/categoria' },
            { label: 'Producto', icon: 'pi pi-tag', to: '/admin/producto' },
            { label: 'Producto detalle', icon: 'pi pi-qrcode', to: '/admin/producto-detalle' }               
        ]
    },
    {
        label: 'Pedidos',
        items: [
            { label: 'Clientes', icon: 'pi pi-fw pi-id-card', to: '/admin/cliente' },
            { label: 'Pedidos', icon: 'pi pi-fw pi-check-square', to: '/admin/pedido' },
            { label: 'Nuevo Pedido', icon: 'pi pi-fw pi-check-square', to: '/admin/pedido/nuevo' }            
         
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>

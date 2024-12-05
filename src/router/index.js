import { createRouter, createWebHistory } from "vue-router";

import Inicio from './../views/web/Inicio.vue'
import Servicios from './../views/web/Servicios.vue'
import Nosotros from './../views/web/Nosotros.vue'

import Login from "../views/auth/Login.vue";
import Registro from "../views/auth/Registro.vue";

import Perfil from "../views/admin/Perfil.vue"
import Usuario from "../views/admin/usuario/Usuario.vue"
import Categoria from "../views/admin/categoria/Categoria.vue"
import Producto from "../views/admin/producto/Producto.vue"
import NuevoPedido from "../views/admin/pedido/nuevo-pedido/NuevoPedido.vue"
import ListaPedido from "../views/admin/pedido/lista-pedido/ListaPedido.vue"

import AppLayout from '@/layout/AppLayout.vue';

const routes = [
    { path: '/', component: Inicio },
    { path: '/servicios', component: Servicios },
    { path: '/nosotros', component: Nosotros },

    { path: '/auth/login', name: 'Login' ,component: Login, meta: {redirectIfAuth: true} },
    { path: '/auth/registro', component: Registro },

    {
        path: '/admin',
        component: AppLayout,
        children: [
            { path: 'perfil', name: 'Perfil', component: Perfil, meta: {requireAuth: true} },
            { path: 'usuario', name: 'Usuario', component: Usuario, meta: {requireAuth: true} },
            { path: 'categoria', name: 'Categoria', component: Categoria, meta: {requireAuth: true} },
            { path: 'producto', name: 'Producto', component: Producto, meta: {requireAuth: true} },
            { path: 'pedido/nuevo', name: 'NuevoPedido', component: NuevoPedido, meta: {requireAuth: true} },
            { path: 'pedido', name: 'ListaPedido', component: ListaPedido, meta: {requireAuth: true} },

        ]
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

// Guards
router.beforeEach((to, from, next) => {
    // console.log(from)
    // console.log(to)
    const token = localStorage.getItem("access_token");

    if(to.meta.requireAuth){
        if(!token){
            return next({name: 'Login'}); 
        }
        return next();
    }

    if(to.meta.redirectIfAuth && token){
        return next({name: 'Perfil'}); 
    }

    return next();
})

export default router;
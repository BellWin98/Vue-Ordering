<template>
    <OrderListComponent
    :isAdmin="true"
    :apiUrl="`${process.env.VUE_APP_API_BASE_URL}/orders`"
    />
</template>

<script>
import OrderListComponent from '@/components/OrderListComponent.vue';
export default {
    components: {
        OrderListComponent
    }
}
</script>
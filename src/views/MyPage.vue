<template>
    <div class="container">
    <div class="page-header text-center mt-5"><h1>회원 정보</h1></div>
    <table class="table">
        <thead>
        <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>도시</th>
            <th>상세주소</th>
            <th>우편번호</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
    <OrderListComponent
    :isAdmin="false"
    apiUrl="http://localhost:8080/member/my-orders"
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
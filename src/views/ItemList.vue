<template>
    <div class="container">
        <div class="page-header text-center mt-5"><h1>상품 목록</h1></div>
        <div class="d-flex justify-content-between" style="margin-top: 20px;">
            <!-- prevent: 새로 고침 방지 -->
            <form @submit.prevent="searchItems">
                <!-- v-model을 하게 되면 양방향 바인딩에 의해 검색창에 키워드를 입력하고 검색 버튼을 누르지 않았는데도 쿼리가 걸림(해결 필요) -->
                <!-- 해결방법: v-model 대신 getElementById 사용 또는 버튼 클릭 전/후로 분기처리-->
                <select v-model="searchType" class="form-control" style="display: inline-block; width: auto; margin-right: 5px;">
                    <option value="optional">선택</option>
                    <option value="name">상품명</option>
                    <option value="category">카테고리</option>
                </select>
                <input v-model="searchValue" class="form-control" style="display: inline-block; width: auto; margin-right: 5px;" />
                <button class="form-control" style="display: inline-block; width: auto; margin-right: 5px;" type="submit">검색</button>
            </form>
            <div>
                <button @click="addCart" class="btn btn-secondary mr-2">장바구니</button>
                <button @click="placeOrder" class="btn btn-success">주문하기</button>
            </div>
        </div>
        <table class="table mt-3">
            <thead>
                <tr>
                    <th></th>
                    <th>제품사진</th>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>재고 수량</th>
                    <th>주문 수량</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in itemList" :key="item.id">
                    <!-- 체크박스를 선택하면 value가 true가 담기게 됨 -->
                    <td><input type="checkbox" v-model="selectedItems[item.id]"/></td>
                    <td><img :src="getImage(item.id)" style="height: 100px; width: auto;"></td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.stockQuantity }}</td>
                    <!-- 자바스크립트의 유연성에 의해 item.quantity가  itemList에 없더라도 자동으로 추가함.  -->
                    <td><input type="number" v-model="item.quantity" min="1" style="width: 60px;"/></td>
                </tr>
            </tbody>
        </table>
    </div>
    </template>
    
    <script>
    import axios from 'axios';
    
    export default {
        data(){
            return {
                itemList: [],
                pageSize: 20,
                currentPage: 0,
                searchType: "name",
                searchValue: "",
                isLastPage: false,
                isLoading: false,
                selectedItems: {},
                // name: "banana"
            }
        },
        // Create는 화면이 그려지기 전에 호출된다.
        created(){
            this.loadItems();
        },
        // 윈도우 DOM 객체가 생성된 이후에 실행되는 Hook 함수
        // DOM(Document 객체): 화면의 HTML 객체가 전부 생성된 이후(화면이 다 그려진 이후) 실행 
        mounted(){
            // scroll 동작이 발생할 때마다 scrollPagination 함수 호출된다는 의미
            window.addEventListener('scroll', this.scrollPagination);
        },
        methods: {
            placeOrder(){
                // console.log(this.selectedItems); // 콘솔로 한번 찍어보기
                // Object.keys: selectedItems 데이터 구조에서 key 값 추출하는 메서드, map은 새로운 데이터를 반환하겠다는 의미
                const orderItems = Object.keys(this.selectedItems)
                                    .filter(key => this.selectedItems[key] === true)
                                    .map(key => {
                                        // 전체 itemList 중, 체크한 item 찾기. == 는 값만 비교함. 숫자, 문자라도 값만 같으면 동일한 것으로 간주
                                        const item = this.itemList.find(item => item.id == key);
                                        return {itemId: item.id, count: item.quantity};
                                    })
                console.log(orderItems);
            },
            searchItems(){
                this.itemList = [];
                this.currentPage = 0;
                this.isLastPage = false;
                this.loadItems();
            },
            scrollPagination(){
                // innerHeight: 브라우저 창의 내부(viewport) 높이를 픽셀 단위로 변환
                // scrollY: 스크롤을 통해 Y축을 이동한 거리
                // offsetHeight: 전체 브라우저 창의 높이
                const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
                if (nearBottom && !this.isLastPage && !this.isLoading){
                    this.currentPage++;
                    this.loadItems();
                }
            },
            getImage(id){
                return `${process.env.VUE_APP_API_BASE_URL}/item/${id}/image`;
            },
            async loadItems(){
                this.isLoading = true;
                try{
                    // 페이지는 파라미터 방식으로 데이터를 받음 (params는 정해진 변수명이다.)
                    // params 키워드를 사용해야 파라미터 방식으로 axios 요청 가능
                    const params = {
                        page: this.currentPage,
                        size: this.pageSize,
                        // [1안]
                        // [this.searchType]: this.searchValue // 위 data에 정의된 searchType의 값을 가져오겠다는 키워드: []. 
                        // name: this.name
                    }
                    // [2안]
                    if (this.searchType === "name"){
                        params.name = this.searchValue; // params에 name이 자동으로 생성된다.
                    } else if (this.searchType === "category"){
                        params.category = this.searchValue;
                    }
                    console.log("data 호출");
                    const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/items`, {params});
                    const additionalItemList = response.data.map(item => ({...item, quantity: 1}));
                    if (additionalItemList.length < this.pageSize){
                        this.isLastPage = true;
                    }
                    this.itemList = [...this.itemList, ...additionalItemList];
                    
                } catch(error){
                    console.log(error);
                }
                this.isLoading = false;
            }
        }
    }
    </script>
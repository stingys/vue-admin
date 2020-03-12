<template>
   <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}">
          {{ item.txt }}
        </li>
      </ul>
    </div>
   </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuTab:[
          { txt: '登录', current: true, type: 'login' },
        { txt: '注册', current: false, type: 'register' }
      ]
    }
  },
}
</script>



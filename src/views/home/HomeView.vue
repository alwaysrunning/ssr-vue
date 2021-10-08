<template>
  <div class="content banner" >
    <h1>Hello Vue SSR</h1>
    <h2> {{ VUESSR }} </h2>
  </div>
</template>
<script>

import {
  mapGetters
} from 'vuex';

export default {
  title() {
    return 'VUE SSR'
  },
  asyncData({ store, route }) {
    return store.dispatch('holiday')
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'userInfo',
    }),
    VUESSR() {
      let { data, code, message } = this.user
      return message
    }
  },
  mounted() {
    this.$store.dispatch('holiday').then(data => {
      console.log(data, 888)
      // this.holidayNotice = data.data || []
    })
  },
  methods: {
   
  },
  beforeDestroy() {
  }
};

</script>
<template>
    <section>
        <img src="/test.png"/>
        <div>
            <input v-model="form.loginname" />
        </div>
        <div>
            <input v-model="form.pwd" />
        </div>

        <el-button @click="clickHandler">提交</el-button>
        <a
        class="button--grey" @click="clickHandler">click</a>
    </section>
</template>

<script>
export default {
    data: () => ({
        form: {
            loginname: '17692190175',
            pwd: '123456'
        }
    }),
    methods: {
        clickHandler() {
            this.$axios.post('/pms/login', this.form).then(res => {
                this.$store.commit('userinfo/update', res.tdata.user);
                // window.location.href = '/teamwork/project'
            });
        }
    },
    mounted() {
        console.log(sjdiof.a);
        $("body").append("xxx");
    }
}
</script>

<style lang="scss" scoped>
    section{
        input{padding:0 1em; border-radius:4px;}
    }
</style>

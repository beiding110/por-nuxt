<template>
    <section>
        <img src="/test.png"/>
        <div>
            <input v-model="form.loginname" />
        </div>
        <div>
            <input v-model="form.pwd" />
        </div>

        <cnzz></cnzz>

        <el-button @click="clickHandler">提交</el-button>
        <a class="button--grey" @click="clickHandler">click</a>

        <my-form>
            <my-checkbox :data="[{key:1,value:'123'}, {key:2,value:'234'}]"></my-checkbox>
        </my-form>
        <my-pagination action="/platform/index/news/list"></my-pagination>

        <upload-s fileguid="fileguid-test-000" single></upload-s>
    </section>
</template>

<script>
export default {
    data: () => ({
        form: {
            loginname: '176*****175',
            pwd: '123456'
        }
    }),
    methods: {
        clickHandler() {
            this.$post('/pms/login', this.form, (data, res) => {
                console.log(data, res)
            });
        }
    },
    mounted() {
        // console.log(sjdiof.a);
        $("body").append("xxx");
    }
}
</script>

<style lang="scss" scoped>
    section{
        input{padding:0 1em; border-radius:4px;}
    }
</style>

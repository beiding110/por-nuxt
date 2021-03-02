<template>
    <div>
        <table>
            <tbody>
                <tr v-for="item in proList" :key="item.newsguid">
                    <td>
                        {{item.title}}
                    </td>
                    <td>
                        {{item.addtime}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import _pt from '~/assets/js/app-node';

export default {
    data: () => {
        tableData: []
    },
    methods: {
        queryData() {
            this.$axios.get('/platform/index/news/list', {
                params: {
                    pageindex: 1
                }
            }).then(res => {
                this.tableData = res.rows;
            });
        }
    },
    mounted() {
        this.queryData();
    }
}
</script>

<style>

</style>

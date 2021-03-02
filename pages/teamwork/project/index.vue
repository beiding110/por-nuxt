<template>
    <section>
        <a
        class="button--grey" @click="clickHandler">click</a>

        <div>
            <table>
                <tbody>
                    <tr v-for="item in proList" :key="item.procode">
                        <td>
                            {{item.proname}}
                        </td>
                        <td>
                            {{item.procode}}
                        </td>
                        <td>
                            {{item.addusername}}
                        </td>
                        <td>
                            {{item.addtime}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
import _pt from '~/assets/js/app-node';

function getProList() {
    return new Promise(resolve => {
        this.$axios.get('/pms/teamwork/xmgl/project/powerpagelist', {
            params: {
                title: '',
                proname: '',
                xmlx: '',
                shstate: '',
                onlyshowhistory: false,
                pagesize: 15,
                starttime: '',
                endtime: '',
                sortname: 'addtime',
                sortorder: 'desc',
                pageindex: 1
            }
        }).then(res => {
            resolve(res)
        });
    })
};

function getUserList() {
    return new Promise(resolve => {
        this.$axios.get('/pms/user/list', {
            params: {
                title: '',
                proname: '',
                xmlx: '',
                shstate: '',
                pagesize: 15,
                starttime: '',
                endtime: '',
                sortname: 'addtime',
                sortorder: 'desc',
                pageindex: 1
            }
        }).then(res => {
            resolve(res)
        });
    });
}

export default {
    async asyncData(context) {
        let [proList, userList] = await Promise.all([
            getProList.call(context).then(res => res.rows),
            // getUserList.call(context).then(res => res.rows)
        ]);

        return {
            proList,
            userList
        }
    },
    methods: {
        clickHandler() {
            getProList.call(this).then(res => {
                this.proList = res.rows;
            });
        }
    },
    mounted() {

    }
}
</script>

<style>

</style>

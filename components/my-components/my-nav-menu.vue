<template>
    <div class="infinite-sub-menu">
            <template v-for="childItem in list">

                <template v-if="!!childItem.children">
                    <el-submenu :index="childItem.id" :key="childItem.id">
                        <template slot="title">
                            <i class="iconfont" v-if="childItem.imgpath" v-html="childItem.imgpath"></i>
                            <span slot="title">{{ childItem.text }}</span>
                            <el-tag type="info" size="mini" v-if="childItem.disabled=='disabled'">过期</el-tag>
                        </template>

                        <my-nav-menu :list="childItem.children" :props="props"></my-nav-menu>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="childItem.mpageurl" :key="childItem.id">
                        <i class="iconfont" v-if="childItem.imgpath" v-html="childItem.imgpath"></i>
                        <template slot="title">
                            <span>{{ childItem.text }}</span>
                            <el-tag type="info" size="mini" v-if="childItem.disabled=='disabled'">过期</el-tag>
                            <el-tag type="danger" size="mini" v-if="!childItem.mpageurl">不可用</el-tag>
                        </template>
                    </el-menu-item>
                </template>

            </template>
        </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: function() {
                return []
            }
        },
        props: {
            type: Object,
            default: function() {
                return {
                    url: 'url'
                }
            }
        }
    },
    data () {
        return {

        }
    },
    methods: {
        sliceUrl: function (href) {
            if (!!href) {
                if (/list/.test(href)) {
                    return href.split('/').slice(0, -1).join('/');
                } else {
                    return href;
                }
            } else {
                return ''
            }
        }
    },
    mounted: function() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

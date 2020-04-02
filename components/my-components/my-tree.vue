<template>
    <el-tree
    :default-checked-keys="value"
    @check-change="checkChange"
    ref="tree"
    :show-checkbox="checkbox"
    :node-key="props.id"
    :default-expand-all="false"
    :data="treeData"
    :props="props"
    :expand-on-click-node="true"
    @node-click="nodeClick"
    :filter-node-method="filterNode"></el-tree>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        url: {
            type: String,
            default: ''
        },
        checkbox: {
            type: Boolean,
            default: false
        },
        props: {
            type: Object,
            default: () => ({
                id: 'id',
                label: 'text',
                children: 'children'
            })
        }
    },
    data: function () {
        return {
            treeData: [],
        }
    },
    computed: {
        bindData: {
            get: function () {
                return this.value;
            },
            set: function (val) {
                this.$emit("input", val);
            }
        }
    },
    methods: {
        getData: function () { //请求数据
            var that = this;
            this.url && this.$get(this.url, function (data) {
                if (inAttr(this.top)) data.splice(0, 0, {
                    id: "0",
                    text: "顶级",
                    value: "0"
                });
                that.treeData = data;
            })
        },
        nodeClick: function (node) { //节点点击事件
            this.$emit("node-click", node);
        },
        checkChange: function () {
            this.bindData = this.$refs.tree.getCheckedKeys();
        },
        filterNode: function (value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
        emitEvent: function (val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted: function () {

        this.getData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

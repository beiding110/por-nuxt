<template>
    <div class="my__table">
        <el-table
        ref="table"
        :border="border"
        :data.sync="!!url ? innerData : data"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        :height="height"
        :max-height="maxHeight"
        :summary-method="summaryMethod"
        :show-summary="showSummary">
            <el-table-column type="selection" width="55" v-if="select" :selectable="selectable"></el-table-column>
        	<slot></slot>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        },
        value: {
            type: Array,
            default() {
                return []
            }
        },
        url: {
            type: String,
            default: ''
        },
        search: {
            type: Object,
            default() {
                return {
                    sortname: 'addtime',
                    sortorder: 'desc'
                }
            }
        },
        summaryMethod: {
            type: Function,
            default: function() {}
        },
        showSummary: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        height: {
            type: [String, Number]
        },
        maxHeight: {
            type: [String, Number]
        },
        theme: {
            type: String,
            default: ''
        },
        select: {
            type: Boolean,
            default: false
        },
        selectable: {
            type: Function,
            default: function() {
                return true;
            }
        }
    },
    data () {
        return {
            innerData: []
        }
    },
    computed: {
        model: {
            get: function() {
                return this.value;
            },
            set: function(e) {
                this.$emit('input', e)
            }
        }
    },
    methods: {
        //表格选中项变化
        handleSelectionChange: function(node) {
            this.model = node;
            this.$emit('selectchange',node);
        },
        /*表格排序事件*/
        sortChange: function(sort){
            this.search.sortname = sort.prop;
            this.search.sortorder = sortorder(sort.order);
            this.$emit('sort', this.search);
        },
        queryData: function () {
            if (!this.url) return;
            this.$get(this.url, this.search, function (data) {
                !!this.after && this.after(data, function (newData) {
                    if (!!newData) {
                        data = newData;
                    }
                });
                this.innerData = data;
            })
        }
    },
    mounted: function() {
        this.queryData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .el-table th.is-leaf{background:#FAFAFA;}
    .my__table /deep/ .el-button.el-button--text{padding:0;}
    /* .my__table{padding: 2em;}
    .my__table .el-table{color: white;}
    .my__table .el-table thead{color: white;}
    .my__table .el-table td, .my__table .el-table th.is-leaf{border-bottom-color: rgba(255, 255, 255, .5)}
    .my__table .el-table, .my__table .el-table th, .my__table .el-table tr{background-color: inherit;}
    .my__table .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: rgba(255, 255, 255, 0.1);}

    .my__table .el-table--border::after, .my__table .el-table--group::after, .my__table .el-table::before{background-color: rgba(255, 255, 255, .5);}
    .my__table .el-table .ascending .sort-caret.ascending{border-bottom-color: #FFCC55;}
    .my__table .el-table .descending .sort-caret.descending{border-top-color: #FFCC55;}

    .my__table .el-table__footer-wrapper tbody td, .my__table .el-table__header-wrapper tbody td{background: inherit; color:white;} */
</style>

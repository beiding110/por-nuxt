<template>
    <div class="my-pagination" :class="'my-pagination_' + position">
        <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="!!search ? search.pagesize || 10 : 10"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Array,
            default() {
                return []
            }
        },
        action: {
            type: String,
            default: ''
        },
        search: {
            type: Object,
            default() {
                return {}
            }
        },
        currentChange: {
            type: Function,
            default: function(){}
        },
        afterQuery: {
            type: Function,
            default: function(){}
        },
        theme: {
            type: String,
            default: ''
        },
        lazy: {
            type: Boolean,
            default: false
        },
        position: {
            type: String,
            default: 'right'
        }
    },
    data () {
        return {
            total: 1,
            currentPage: 1
        }
    },
    computed: {
        pageData: {
            get: function () {
                return this.value
            },
            set: function (e) {
                this.$emit('input', e)
            }
        }
    },
    methods: {
        queryData: function (page) {
            var that = this;
            this.$nextTick(function () {
                if (!that.action) {
                    throw new Error('请绑定action属性（数据api请求地址）');
                } else {
                    page = (page || 1);

                    var searchData = {};
                    var searchData = this.search || {};

                    this.currentPage = page;
                    searchData.pageindex = page;
                    searchData.sortname = (!!searchData.sortname || searchData.sortname === '') ? searchData.sortname : 'addtime';
                    searchData.sortorder = searchData.sortorder || 'desc';

                    this.$get(that.action, searchData, function (data, res) {
                        !!this.afterQuery && this.afterQuery(data.rows, data);
                        that.pageData = data.rows;
                        that.$nextTick(function() {
                            that.total = data.total;
                        });

                        this.$emit('update:extra', data.extra);
                    });
                }
            })
        },
        handleCurrentChange: function (e) {
            !!this.currentChange && this.currentChange();
            this.$emit('currentChange', e);
            this.queryData(e);
        },
        reload: function () {
            this.queryData(this.currentPage);
        }
    },
    mounted: function() {
        !this.lazy && this.queryData(1)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.my-pagination{margin-top:1em;}
.my-pagination.my-pagination_left{text-align:left;}
.my-pagination.my-pagination_center{text-align:center;}
.my-pagination.my-pagination_right{text-align:right;}
</style>

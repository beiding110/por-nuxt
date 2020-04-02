<template>
    <el-select
    v-model="svalue"
    :placeholder="placeholder"
    filterable
    @change="selectChange"
    @visible-change="visibleChange"
    @focus="focus"
    :clearable="clearable"
    :size="size"
    :disabled="disabled"
    :allow-create="allowCreate">
        <el-option
        v-for="pName in Object.keys(options)"
        :key="options[pName][props.value]"
        :label="options[pName][props.label]"
        :value="options[pName][props.value]">
        	<slot v-bind:row="options[pName]"></slot>
        </el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        disabled:{
            type:Boolean,
            default:false
        },
        clearable:{
            type:Boolean,
            default:true
        },
        multireturn: {
            default: false
        }, //是否返回多个值
        url: {
            type: String
        }, //导入的url地址
        value: {
            type: String
        }, //接受外部v-model传入的值
        props: {
            type: Object,
            default: function () {
                return {
                    label: "value",
                    value: "key"
                }
            }
        }, //定义数据中作为select的label与value的字段
        placeholder: {
            type: String,
            default: '请选择'
        },
        filterable: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: false
        },
        size: {
            type: String
        },
        allowCreate: {
            type: Boolean,
            default: false
        },
        '2way': {
            type: String
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            options: [],
        }
    },
    computed: {
        svalue: {
            get: function () {
                return this.value;
            },
            set: function (e) {
                this.$emit('input', e);
            }
        }
    },
    methods: {
        focus:function(){
            this.$emit('focus');
        },
        visibleChange:function(){
            this.$emit('visiblechange');
        },
        queryData: function () {
            var that = this
            if (!!this.url) {
                that.$get(that.url, function (data) {
                    try {
                        // that.options =that.multireturn ? that.list2map(data) :data;
                        that.options = that.list2map(data || []);
                    } catch (e) {
                        throw new Error(e)
                    }
                })
            } else if(this.data.length > 0) {
                try {
                    // that.options =that.multireturn ? that.list2map(data) :data;
                    that.options = that.list2map(this.data || []);
                } catch (e) {
                    throw new Error(e)
                }
            } else {
                // throw new Error('my-select 未绑定字典数据url')
            }
        },
        list2map: function (list) {
            var that = this;
            return list.reduce(function (map, item) {
                map[item[that.props.value]] = item;
                return map;
            }, {})
        },
        selectChange: function (item) {
            if(this['2way']) {
                var modelArr = this['2way'].split(',');
                modelArr.forEach(function(key) {
                    this.$emit('update:'+key, (this.options[item] || {})[key])
                }.bind(this));
            };

            this.$emit("select", this.options[item] || {});
        }
    },
    watch: {
        url: function () {
            this.queryData();
        },
        data() {
            this.queryData();
        }
    },
    mounted: function () {
        this.queryData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<template>
    <span class="my__checkbox">
        <span v-if="!readonly">
            <el-checkbox-group v-model="model" style="display:inline-block;">
            	<el-checkbox
                    v-for="item in list"
                    :key="item[props.key]"
                    :label="item[!!props ? !!props.value ? props.value : 'key' : 'key']">
                    {{item[!!props ? !!props.label ? props.label : 'value' : 'value']}}
                </el-checkbox>
            </el-checkbox-group>
            <el-checkbox v-model="otherController" style="margin-left:1em;" v-if="other" disabled>
                <el-input v-model="input" placeholder="其它" size="mini"></el-input>
            </el-checkbox>
        </span>
        <span v-else>
            {{readonlyStr}}
        </span>
        <slot></slot>
    </span>
</template>

<script>
export default {
    name: 'my-checkbox',
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
        other: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default() {
                return []
            }
        },
        props: {
            type: Object,
            default() {
                return {
                    key: 'key',
                    value: 'value'
                }
            }
        },
        readonly: {
            type: Boolean,
            default: false
        },
        all: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            list: [],
            otherController: false,

            readonlyStr: ''
        }
    },
    computed: {
        model: {
            get: function () {
                return this.other ? this.value.slice(0, -1) : this.value;
            },
            set: function (val) {
                if (this.other) {
                    var res = clone(val);
                    res.push(this.input);
                };
                this.$emit('input', this.other ? res : val);
                this.$emit('change', this.other ? res : val);
            }
        },
        input: {
            get: function () {
                return this.other ? this.value.slice(-1) : '';
            },
            set: function (n) {
                this.otherController = !!n;

                if (this.other) {
                    var res = clone(this.model);
                    res.push(n);
                };
                this.$emit('input', this.other ? res : val);
                this.$emit('change', this.other ? res : val);
            }
        },
    },
    watch: {
        data: {
            handler: function (n, o) {
                if (n != o) {
                    this.list = n;
                    this.readonlyStr = this.fetchKey();
                };
            },
            deep: true
        },
        value: function (n, o) {
            this.readonlyStr = this.fetchKey();
        },
        input: function (n, o) {
            if (n.slice(-1) != o.slice(-1) && /,|\/|;|、|，/.test(n.slice(-1))) {
                ShowMsg.call(this, '无效的特殊字符', 'error');
                this.input = o;
            }
        }
    },
    methods: {
        queryData: function () {
            if (!!this.action) {
                this.$get(this.action, function (data) {
                    this.list = data;

                    this.readonlyStr = this.fetchKey();
                })
            } else {
                this.list = this.data;

                this.readonlyStr = this.fetchKey();
            }
        },
        fetchKey: function () {
            var that = this;
            var res = [];
            this.list.forEach(function (item) {
                if (that.all) {
                    res.push(item[that.props ? that.props.value : 'value']);
                } else {
                    if (item[that.props ? that.props.key : 'key'] == that.value) {
                        res.push(item[that.props ? that.props.value : 'value']);
                    }
                }

            })
            return res.join(',');
        }
    },
    mounted: function () {
        this.queryData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .my__checkbox{

    }
</style>

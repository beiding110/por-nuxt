<template>
    <el-radio-group v-model="model" class="my__radio">
        <template v-for="item in list">
    	   <el-radio :label="props.value" :key="item.value">{{item[props.label]}}</el-radio>
        </template>
        <slot>

        </slot>
    </el-radio-group>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        action: {
            type: String,
            default: ''
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
                    value: 'key',
                    label: 'value'
                }
            }
        }
    },
    data: function () {
        return {
            list: [],
        }
    },
    computed: {
        model: {
            get: function () {
                return this.value;
            },
            set: function (val) {
                this.$emit('input', val);
            }
        }
    },
    watch: {
        data: {
            handler: function (n, o) {
                if (n != o) {
                    this.list = n
                }
            },
            deep: true
        }
    },
    methods: {
        queryData: function () {
            if (!!this.action) {
                this.$get(this.action, function (data) {
                    this.list = data;
                })
            } else {
                this.list = this.data;
            }
        }
    },
    mounted: function () {
        this.queryData();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .my__radio{}
</style>

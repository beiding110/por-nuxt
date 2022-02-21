<template>
    <el-dialog
    class="my-dialog"
    :title="title"
    @opened="opened"
    :width="width"
    :visible.sync="model"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close = "close"
    :show-close="showclose"
    :before-close="beforeClose"
    >

        <div 
        v-if="$slots.head"
        class="head"
        >
            <slot name="head"></slot>
        </div>

        <div class="body">
            <slot></slot>
        </div>

        <div 
        v-if="$slots.foot"
        class="foot" 
        >
            <slot 
                name="foot"
                :close="close"
            ></slot>
        </div>

    </el-dialog>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '50%'
        },
        showclose: {
            type: Boolean,
            default: false
        },
        hasBeforeClose:{
            type:[Function, Boolean],
            default:false
        }
    },
    data () {
        return {

        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(n, o) {
                this.$emit('input', n);
            }
        }
    },
    methods: {
        beforeClose:function(done){
            if(typeof(this.hasBeforeClose) == 'function'){
                this.hasBeforeClose(done);
            }else{
                done();
            }
        },
        close(){
            this.$emit('close')
        },
        opened() {
            this.$emit('show')
        },
    },
    mounted: function() {
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.my-dialog{
    ::v-deep {
        .el-dialog__header{
            padding: 0;

            .el-dialog__headerbtn{
                z-index: 10;
            }
        }

        .el-dialog__body{
            padding: 35px 40px;
        }
    }

    .head{
        font-size: 16px;
        color: #333;
        font-weight: bold;
        margin-bottom: 16px;
        line-height: 1em;
    }

    .foot{
        text-align: center;
    }
}
</style>

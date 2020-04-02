<template>
    <div>
        <el-form :inline="true" :model="pgData" size="small">
            <slot></slot>
            <slot name="time">
                <el-form-item>
                    <el-date-picker value-format="yyyy-MM-dd" v-model="pgData.time" type="daterange" range-separator="至" :start-placeholder="!!timeStartPlaceholder ? timeStartPlaceholder : '开始日期'" :end-placeholder="!!timeEndPlaceholder ? timeEndPlaceholder : '结束日期'" popper-class="bd__datepiaker"></el-date-picker>
                </el-form-item>
            </slot>
            <slot name="title">
                <el-form-item>
                    <el-input v-model="pgData.title" :placeholder="!!titlePlaceholder ? titlePlaceholder : '标题'" clearable></el-input>
                </el-form-item>
            </slot>
            <el-form-item>
                <el-button type="primary" @click="onSearchSubmit">查询</el-button>
            </el-form-item>
            <slot name="dr"></slot>
        </el-form>
    </div>
</template>

<script>
export default {
    props: ['value', 'titlePlaceholder', 'timeStartPlaceholder', 'timeEndPlaceholder', 'alive'],
    data () {
        return {
            pgData: {
                time: [],
                title: '',
            }
        }
    },
    watch: {
        pgData: {
            handler: function (val, old) {
                this.valReCalc(val)
            },
            deep: true
        }
    },
    methods: {
        onSearchSubmit: function () {
            setSession('search[' + window.location.pathname + ']['+this._uid+']', this.value);
            this.$emit('search');
        },
        valReCalc: function (val) {
            var that = this;

            var n = clone(val);
            Object.keys(this.value).forEach(function (item) {
                n[item] = that.value[item];
            });

            n.starttime = !!val.time ? val.time[0] || '' : '';
            n.endtime = !!val.time ? val.time[1] || '' : '';
            n.title = val.title;
            delete n.time;

            n.sortname = !!n.sortname || n.sortname === '' ? n.sortname : 'addtime';
            n.sortorder = !!n.sortorder ? n.sortorder : 'desc';

            n.pagesize = n.pagesize || 10;

            this.$emit('input', n);

            return n;
        }
    },
    created: function () {
        if (this.alive !== false || this.alive !== 'false') {
            var searchSession = getSession('search[' + window.location.pathname + ']['+this._uid+']');
            if (!!searchSession) {
                searchSession.time = (!!searchSession.starttime && !!searchSession.endtime) ? [searchSession.starttime, searchSession.endtime] : [];
                this.pgData = searchSession;
                this.$emit('input', searchSession);
            };
        }
    },
    mounted: function () {
        this.valReCalc(this.pgData);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .my__form{padding: 2em 2em 0;}
    .my__form .el-input__inner, .my__form input{background-color: rgba(0,0,0,0);}
    .my__form .el-button--primary{background: #FFCC55; border-color:#FFCC55;}
    .my__form .el-button--primary:focus, .my__form .el-button--primary:hover{background:#FFD779; border-color: #FFD779}
</style>

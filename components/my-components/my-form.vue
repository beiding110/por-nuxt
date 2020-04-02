<template>
    <el-form ref="form" :model="form" :label-width="labelWidth||'80px'" :size="size" :label-position="labelPosition"
    :disabled="disabled || readonly" :class="disabled||readonly ? 'disabled' : ''"
    :inline="inline" v-loading.sync="submitLoadingController">
    <slot></slot>
    <el-form-item label-width="0" style="text-align:center;margin-top: 20px;" v-if="!readonly">
        <slot name="btn" :submit-handler="onSubmit" :cancle-handler="onCancle" :submit-loading="submitLoadingController">
            <el-button type="primary" @click="onSubmit" class="form-btn" :loading="submitLoadingController">保存</el-button>
            <el-button @click="onCancle" class="form-btn">取消</el-button>
        </slot>
    </el-form-item>
</el-form>
</template>

<script>
import _pt from '~/assets/js/porcupine-tools'

export default {
    props: {
        labelWidth: {
            type: String,
            default: '80px'
        },
        value: {
            type: Object,
            default: () => ({})
        },
        detailExtra: {
            type: Object,
            default: () => ({})
        },
        submitUrl: {
            type: String,
            default: ''
        },
        detailUrl: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: ''
        },
        labelPosition: {
            type: String,
            default: ''
        },
        inline: {
            type: Boolean,
            default: false
        },
        file: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        sendStr: {
            type: Boolean,
            default: false
        },
        beforeSend: {
            type: Function,
            default: function() {}
        },
        afterSend: {
            type: Function,
            default: function() {}
        },
        afterDetail: {
            type: Function,
            default: function() {}
        },
    },
    data() {
        return {
            submitLoadingController: false,
            submitLock: false,

            shadebox: null
        }
    },
    computed: {
        form: {
            get: function () {
                return this.value
            },
            set: function (n, o) {
                this.$emit('input', n);
            }
        }
    },
    methods: {
        onSubmit: function (e, callback) {
            var that = this;

            new _pt.Chain().link(function (obj, next) {
                if (obj.submitLock) {
                    obj.notify({
                        message: '提交过快，请稍后重试',
                        type: 'warning'
                    });
                    return;
                };
                next();
            }).link(function (obj, next) {
                if (obj.submitLoadingController) {
                    return;
                };
                next();
            }).link(function (obj, next) {
                obj.submitLoadingController = true;
                // obj.shadebox.show();

                obj.$nextTick(function () {
                    next()
                });
            }).link(function (obj, next) {
                !!obj.beforeSend && obj.beforeSend();
                obj.$nextTick(function () {
                    next();
                })
            }).link(function (obj, next) {
                obj.$refs['form'].validate(function (valid) {
                    if (valid) {

                        Object.keys(obj.form).forEach(function (key) {
                            obj.form[key] = typeof (obj.form[key]) === 'string' ?
                            obj.form[key].replace(/^\s+|\s+$/g, "") :
                            obj.form[key];
                        });

                        if (!!obj.submitUrl) {
                            obj.$ajax({
                                type: 'post',
                                url: obj.submitUrl,
                                data: obj.form,
                                callback: function (data, res) {
                                    obj.$emit('submit');
                                    obj.notify({
                                        message: res.msg,
                                        type: 'success'
                                    });

                                    obj.close();

                                    !!callback && callback();
                                },
                                fztype: obj.sendStr,
                                complete: function () {
                                    next();
                                }
                            });
                        } else {
                            obj.$emit('submit');
                            next();
                        };
                    } else {
                        obj.submitEnd();
                        return false;
                    };
                });
            }).link(function (obj, next) {
                !!obj.afterSend && obj.afterSend();
                obj.$nextTick(function () {
                    next();
                })
            }).link(function (obj, next) {
                obj.submitEnd();
                obj.$nextTick(function () {
                    next();
                });
            }).run(this);
        },
        onCancle: function () {
            this.$emit('cancle');
        },
        close: function () {
            var that = this;
            try {
                this.submitEnd();
            } catch (e) {}
        },
        submitEnd: function () {
            this.submitLoadingController = false;
            this.submitLock = true;
            // this.shadebox.hide();

            setTimeout(function () {
                this.submitLock = false;
            }.bind(this), 1000);
        },
        queryDetail: function () {
            if (!!this.detailUrl) {
                var that = this;
                if (this.file) {
                    this.$get(this.detailUrl, this.detailExtra, function (data) {
                        !!this.afterDetail && this.afterDetail(data);
                        this.form = data;
                    })
                } else {
                    var extra = true;
                    !!this.detailExtra && Object.keys(this.detailExtra).forEach(function (item) {
                        if (!that.detailExtra[item]) extra = false;
                    })
                    if (extra) {
                        this.$get(this.detailUrl, this.detailExtra, function (data) {
                            !!this.afterDetail && this.afterDetail(data);
                            this.form = data;
                        })
                    } else {
                        // !!this.afterDetail && this.afterDetail();
                    }
                }
            }
        },
        reset: function () {
            this.$refs['form'].resetFields();
        }
    },
    mounted: function () {
        var that = this;
        // this.shadebox = new ShadeBox({
        //     innerHTML: '<div style="position:absolute; left:50%; top:40%; transform:translate(-50%,-50%)"><i class="el-icon-loading"></i>处理中……</div>'
        // });
        this.queryDetail();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.disabled.el-form /deep/ .el-form-item {
    margin-bottom: 2px;
}

.form-btn{display:inline-block;}
</style>

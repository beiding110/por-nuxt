<template>
    <el-form
    ref="form"
    :model="form"
    :label-width="labelWidth"
    :size="size"
    :label-position="labelPosition"
    :disabled="disabled || readonly"
    :class="{disabled:disabled||readonly, 'table-view':table}"
    :inline="inline"
    v-loading.sync="submitLoadingController">
        <slot></slot>
        <el-form-item label-width="0" class="btn-row" v-if="!readonly">
            <slot name="btn" :submit-handler="onSubmit" :cancle-handler="onCancle" :submit-loading="submitLoadingController">
                <el-button type="primary" @click="onSubmit" :style="btn_styl" :loading="submitLoadingController">保存</el-button>
                <el-button @click="onCancle" :style="btn_styl">取消</el-button>
            </slot>
        </el-form-item>
    </el-form>
</template>

<script>
import appNode from '@js/app-node'

export default {
    props: {
        labelWidth: {
            type: String,
            default: '120px'
        },
        value: {
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
            default: 'small'
        },
        labelPosition: {
            type: String,
            default: 'right'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        beforeSend: {
            type: [Function, Boolean],
            default: false
        },
        afterSend: {
            type: [Function, Boolean],
            default: false
        },
        afterDetail: {
            type: [Function, Boolean],
            default: false
        },
        detailExtra: {
            type: Object,
            default: () => ({})
        },
        sendStr: {
            type: Boolean,
            default: false
        },
        file: {
            type: Boolean,
            default: false
        },
        inline: {
            type: Boolean,
            default: false
        },
        table: {
            type: Boolean,
            default: false
        }
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
        },
        btn_styl: function () {
            return {
                'display': 'inline-block'
            }
        }
    },
    methods: {
        onSubmit: function (e, callback) {
            var that = this,
                ajaxRes;

            new appNode.Chain().link(function (next) {
                if (that.submitLock) {
                    ShowMsg.call(that, '提交过快，请稍后重试');
                    return;
                };
                next();
            }).link(function (next) {
                if (that.submitLoadingController) {
                    return;
                };
                next();
            }).link(function (next) {
                that.submitLoadingController = true;
                // that.shadebox.show();

                that.$nextTick(function () {
                    next()
                });
            }).link(function (next) {
                if(that.beforeSend) {
                    that.beforeSend(function() {
                        that.$nextTick(function () {
                            next();
                        })
                    }, function() {
                        that.submitEnd();
                    });
                } else {
                    next();
                }
            }).link(function (next) {
                that.$refs['form'].validate(function (valid) {
                    if (valid) {

                        Object.keys(that.form).forEach(function (key) {
                            that.form[key] = typeof (that.form[key]) === 'string' ?
                            that.form[key].replace(/^\s+|\s+$/g, "") :
                            that.form[key];
                        });

                        if (!!that.submitUrl) {
                            that.$ajax({
                                type: 'post',
                                url: that.submitUrl,
                                data: that.form,
                                callback: function (data, res) {
                                    ajaxRes = res;
                                    that.$emit('submit');
                                    ShowMsg.call(that, res.msg || '保存成功', 'success');

                                    that.close();

                                    !!callback && callback();
                                },
                                fztype: that.sendStr,
                                complete: function () {
                                    next();
                                }
                            });
                        } else {
                            that.$emit('submit');
                            next();
                        };
                    } else {
                        that.submitEnd();
                        return false;
                    };
                });
            }).link(function (next) {
                !!that.afterSend && that.afterSend(ajaxRes);
                that.$nextTick(function () {
                    next();
                })
            }).link(function (next) {
                that.submitEnd();
                that.$nextTick(function () {
                    next();
                });
            }).run();
        },
        onCancle: function () {
            this.$emit('cancle');
        },
        close: function () {
            var that = this;
            try {
                this.onCancle();

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
                        !!this.afterDetail && this.afterDetail();
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
        this.queryDetail();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.disabled.el-form ::v-deep .el-form-item {
    margin-bottom: 2px;
}
.btn-row{text-align:center; margin-top:20px;}

$tableBorderColor: #E8E8E8;
.table-view{border-left:1px solid $tableBorderColor; border-top:1px solid $tableBorderColor; overflow:hidden; display:flex; flex-wrap:wrap;
    ::v-deep .el-form-item{margin:0; border-right:1px solid $tableBorderColor; border-bottom:1px solid $tableBorderColor; box-sizing:border-box;}
    ::v-deep .el-form-item:not(.btn-row){width:50%; position:relative;
        .el-form-item__label{height:100%; line-height:normal; border-right:1px solid $tableBorderColor; box-sizing:border-box; background:#F9FBFE; display:flex; align-items:center; justify-content:flex-end;}
        .el-form-item__content{padding:5px; position:relative; min-height:2em;
            .el-form-item__error{top:auto; bottom:0; left:5px;}
        }
    }
    .btn-row{width:100%; padding:1em 0;}
}
@media screen and (max-width: 1000px) {
    .table-view{
        ::v-deep .el-form-item:not(.btn-row){width:100%;}
    }
}
</style>

<template>
    <div>
        <el-upload
        multiple
        :drag="drag && !readonly"
        ref="FileUp"
        :action="action"
        :data="extraData"
        :show-file-list="false"
        :limit="limit"
        :before-upload="beforeAvatarUpload"
        :on-exceed="handleExceed"
        :on-success="onSuccess"
        :on-error="onError"
        :auto-upload="!lazy"
        :on-change="onchange"
        :accept="fileType">
        <slot slot="trigger">
            <template v-if="!drag">
                <el-button size="small" type="primary" v-show="myReadonly"><i class="el-icon-upload"></i> {{title}}</el-button>
            </template>
            <template v-else>
                    <template v-if="myReadonly">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </template>
                </template>
            </slot>

            <template v-if="drag && !readonly">
                <br>
            </template>

            <span :style="{marginLeft:readonly ? '' : '1em'}" v-if="single" class="single__file--name">
                <a
                target="_blank"
                :href="fileList[0] ? (fileList[0].filesavepath + pathSupply) : ''">
                    {{fileList[0] ? fileList[0].fileoldname + '.' + fileList[0].filetype : ''}}
                </a>
            </span>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-if="lazy">上传到服务器</el-button>
        </el-upload>

        <div slot="tip" class="file-type_tip" v-if="!readonly">
            <font v-if="!!fileType">
                只能上传{{fileType}}文件
            </font>
            <font v-if="!!fileSize">不能超过{{fileSize}}M</font>
        </div>

        <el-table
        style="width:100%; margin-top:5px;"
        v-bind:border="true"
        v-bind:data="fileList"
        empty-text="暂无文件"
        v-if="!single">
            <el-table-column label="文件名称" sortable>
                <template slot-scope="scope">
                    <a
                    target="_blank"
                    :href="scope.row.filesavepath + pathSupply">
                        {{scope.row.fileoldname + '.' + scope.row.filetype}}
                    </a>
                </template>
            </el-table-column>
            <el-table-column prop="addtime" label="上传时间" sortable></el-table-column>
            <el-table-column prop="addusername" label="上传人"></el-table-column>
            <el-table-column label="操作" width="150px" v-if="myReadonly">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        action: {
            type: String,
            default: '/bhtong/sysfile/sys/uploadfile'
        },
        fileType: {
            type: String,
            default: ''
        },
        fileGuid: {
            type: String,
            default: '',
            required: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number
        },
        fileSize: {
            type: Number,
            default: 10
        },
        single: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '点击上传'
        },
        lazy: {
            type: Boolean,
            default: false
        },
        drag: {
            type: Boolean,
            default: false
        },
    },
    data: function () {
        return {
            preview: false,
            imageurl: "",
            fileList: [],
            percent: 0,
            percentStatus: '',
            loading: null,

            fileTypeObj: {
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
            }
        }
    },
    computed: {
        myReadonly: function () {
            return !this.readonly;
        },
        extraData: function () {
            return {
                FileGuid: this.fileGuid,
                FileType: this.fileType,
                Multifile: !this.single
            }
        },
        pathSupply() {
            return /micromessenger/i.test(navigator.userAgent) ? '?mp.wexin.qq.com' : ''
        }
    },
    methods: {
        bindFileList: function (fileGuid) { //绑定文件列表
            var that = this;

            if(!fileGuid) {return;}

            this.$get("/bhtong/sysfile/getfilelist", {
                id: fileGuid
            }, function (data) {
                that.fileList = data || [];
                this.$emit('update', that.fileList);
            });
            this.fileListUpdateHandler();
        },
        handleDelete: function (index, row) { //删除文件
            var that = this;
            this.$get("/bhtong/sysfile/delfile", {
                id: row.rowguid
            }, function (obj, res) {
                that.fileList.splice(index, 1);
                this.$emit('update', this.fileList);
            });
            this.fileListUpdateHandler();
        },
        beforeAvatarUpload: function (file) {
            var arr = file.name.split('.');
            var type = arr[arr.length - 1],     //从最后一个点开始判断文件类型
                size = file.size / 1024 / 1024;
            if (!!this.fileType) {
                var typeArr = this.fileType.split(',');
                if(!typeArr.some(function(item) {
                    return ((new RegExp(type)).test(item))
                })) {
                    // ShowMsg.call(this, '文件类型应为:' + this.fileTypeObj[this.fileType] || this.fileType.split('/')[1], 'error');
                    ShowMsg.call(this, '文件类型应为:\n' + this.fileType, 'error');
                    return false;
                }
            };

            var fs = this.fileSize;

            if(size > fs) {
                ShowMsg.call(this, '文件大小超过:' + fs + 'M', 'error');
                return false;
            };
            this.loading = this.$loading({
                lock: true,
                text: '上传中',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            return true;
        },
        handleExceed: function (files, fileList) {
            !!this.limit && ShowMsg.call(this, '限制上传' + this.limit + '个文件', 'error')
        },
        onSuccess: function (response, file, fileList) {
            this.loading.close();
            var obj = typeof (response) == 'string' ? JSON.parse(response) : response;

            ajaxResCheck.call(this, obj, function () {
                this.fileList = obj.tdata;
                
                ShowMsgBox.call(this, obj.msg ? obj.msg : "上传成功",'success');
                this.$emit('update', fileList);
                this.$emit('success', obj);
            }.bind(this));
            this.fileListUpdateHandler();
        },
        onError: function (err, file, fileList) {
            var that = this
            this.loading.close();
            ShowMsgBox.call(this, err, 'error');
            this.percent = 100;
            this.percentStatus = 'exception'
            this.$nextTick(function () {
                setTimeout(function () {
                    that.percentBar = false;
                }, 500)
            })
        },
        submitUpload: function () {
            this.$refs.FileUp.submit();
        },
        onchange: function (file, filelist) {
            if (this.lazy) {
                if (this.single) {
                    this.fileList.splice(0, 1, {
                        fileoldname: file.name
                    })
                } else {
                    var indexArr = [];
                    this.fileList.forEach(function (item) {
                        filelist.forEach(function (file, index) {
                            if (item.fileoldname == file.name) {
                                indexArr.push(index);
                            }
                        })
                    });

                    indexArr.forEach(function (item) {
                        this.fileList.push({
                            fileoldname: filelist[item].name
                        });
                    });
                }
            };
            this.fileListUpdateHandler();
        },
        fileListUpdateHandler: function() {
            this.$emit('update', this.fileList);
            this.$emit('update:files', this.fileList);
        }
    },
    mounted: function () {
        try {
            this.bindFileList(this.fileGuid);
        } catch (e) {}
    },
    watch: {
        fileGuid: function (e) {
            if (e) {
                this.bindFileList(e);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .file-type_tip{font-size:12px; color:#909399; line-height:1em;}
</style>

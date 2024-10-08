<template>
    <div class="tinymce">
        <editor
            v-if="!readonly"
            v-model="model"
            :init="init"
            :disabled="disabled"
            :tinymce-script-src="'/plugin/tinymce/tinymce.min.js'"
        ></editor>

        <div
            class="richtext"
            v-else
            v-html="model"
        ></div>
    </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import { getToken } from '@js/token';

export default {
    components: {
        Editor,
    },
    props: {
        value: {
            type: String,
            default: '',
        },
        // 不可编辑
        disabled: {
            type: Boolean,
            default: false,
        },
        // 只读，仅展示富文本
        readonly: {
            type: Boolean,
            default: false,
        },
        //默认插件 选择你需要的 注释掉的为富文本全部默认插件
        plugins: {
            type: [String, Array],
            default:
                'searchreplace autolink directionality visualblocks visualchars fullscreen image link template code table hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave autoresize',
            // preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr nonbreaking insertdatetime advlist lists wordcount imagetools textpattern autosave bdmap autoresize
        },
        //默认工具栏 选择你需要的 注释掉的为富文本全部默认工具
        toolbar: {
            type: [String, Array],
            default: `
                code undo redo | cut copy paste | forecolor backcolor bold italic underline strikethrough link | alignleft aligncenter alignright alignjustify outdent indent formatpainter | bullist numlist |
                styleselect formatselect fontselect fontsizeselect | blockquote subscript superscript removeformat | 
                table image hr pagebreak insertdatetime | fullscreen
                `,

            // `
            // code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link codesample | alignleft aligncenter alignright alignjustify outdent indent  formatpainter |
            // styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat |
            // table image media charmap hr pagebreak insertdatetime | fullscreen preview
            // `
        },
    },
    data() {
        return {
            init: {
                language_url: '/plugin/tinymce/langs/zh-Hans.js',
                language: 'zh-Hans',
                entities: '&nbsp;',
                height: 600,
                min_height: 600,
                max_height: 800,
                toolbar_mode: 'wrap',
                plugins: this.plugins,
                toolbar: this.toolbar,
                content_style: 'p {margin: 5px 0;min-height:1em;}',
                fontsize_formats:
                    '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                font_formats:
                    '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
                branding: false,
                contextmenu: 'undo redo | cut copy paste | selectall', // 富文本右键菜单
                relative_urls: false,
                convert_urls: false,
                images_upload_handler: this.imagesUploadHandler,
                menubar: 'file edit view format tools table',
                relative_urls: false, // 相对路径
            },

            imageUploadUrl: `${this.getGetters('fileUrl')}/file-upload/editor`,
        };
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        // 内容为空
        empty() {
            if (!this.value || !this.value.length) {
                return true;
            }

            var strTrim = this.model
                .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
                .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
                .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
                .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
                .replace(/\n/gi, ''); // 将所有 换行符 replace ''

            if (!strTrim.length) {
                return true;
            }

            return /^[ ]+$/.test(strTrim);
        },
    },
    methods: {
        // 图片上传操作
        imagesUploadHandler(blobInfo, success, failure, progress) {
            var xhr, formData;

            xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open('POST', this.imageUploadUrl);

            xhr.setRequestHeader(
                'Authorization',
                window.$_plat_config.sys.authorization
            );
            xhr.setRequestHeader('bidding-auth', getToken());

            xhr.upload.onprogress = function (e) {
                progress((e.loaded / e.total) * 100);
            };

            xhr.onload = function () {
                var json;

                if (xhr.status === 403) {
                    failure('HTTP Error: ' + xhr.status, {
                        remove: true,
                    });
                    return;
                }

                if (xhr.status < 200 || xhr.status >= 300) {
                    failure('HTTP Error: ' + xhr.status);
                    return;
                }

                json = JSON.parse(xhr.responseText);

                if (!json || typeof json.data !== 'string') {
                    failure('Invalid JSON: ' + xhr.responseText);
                    return;
                }
                
                success(json.data);

                // 返回值中只有地址
                // var url = xhr.responseText;

                // if (!url || typeof url !== 'string') {
                //     failure('Invalid URL: ' + xhr.responseText);
                //     return;
                // }

                // success(url);

                // 将图片转换成base64
                // let base64 = "data:"+ blobInfo.blob().type + ";base64,"  + blobInfo.base64();

                // success(base64);
            };

            xhr.onerror = function () {
                failure(
                    `Image upload failed due to a XHR Transport error. Code: ${xhr.status}`
                );
            };

            formData = new FormData();
            formData.append('fileTypeClass', '');
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            xhr.send(formData);
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.tinymce {
    .richtext {
        word-break: break-all;
    }
}
</style>


<style>
/* 组件在dialog或者drawer中被遮挡 */
/* 富文本菜单 */
.tox-tinymce-aux {
    z-index: 9999 !important;
}
.tox-tinymce {
    border-radius: 0 !important;
}
</style>



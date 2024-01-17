<template>
    <div class="file-list">
        <file-item
            v-for="(item, index) in data"
            :key="index"
            :data="item"
            :action="action"
            @del="$emit('del', {data: $event, index})"
            :size="size"
            :btn-layout="btnLayout"
        ></file-item>

        <slot></slot>
    </div>
</template>

<script>
import FileItem from './file-preivew-item';

export default {
    components: {
        FileItem,
    },
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        action: {
            type: Object,
            default: () => ({}),
        },
        size: {
            type: [String,Number],
            default: 178,
        },
        btnLayout: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            
        };
    },
};
</script>

<style lang="scss" scoped>
    .file-list{
        overflow: hidden;
        margin: -5px;
        margin-right: 5px;
    }
</style>
<template>
    <span :id='`cnzz_stat_icon_${cid}`' :style="conStype"></span>
</template>

<script>
import config from '@config/index'
export default {
    props: {
        hide: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {

        }
    },
    computed: {
        conStype() {
            return {
                display: this.hide ? 'none' : 'inline'
            };
        },
        cid() {
            return config.plugins.cnzz.id;
        }
    },
    watch: {
        '$route'() {
            if (window._czc) {
                let location = window.location
                let contentUrl = location.pathname + location.hash
                let refererUrl = '/'
                window._czc.push(['_trackPageview', contentUrl, refererUrl])
            }
        }
    },
    methods: {
        setCnzz() {
            if (document.querySelector('id[class^="cnzz_stat_icon_"]')) {
                // 防止重复加载
                return;
            }

            if (document.querySelector('script[src*="s9.cnzz.com/z_stat.php"]')) {
                // 防止重复加载
                
                return;
            }

            var script = document.createElement('script'),
            protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
            script.src = (protocol + `s9.cnzz.com/z_stat.php?id=${this.cid}&show=pic1`);
            script.language = 'javascript';
            document.body.appendChild(script)
        }
    },
    mounted: function() {
        this.setCnzz();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

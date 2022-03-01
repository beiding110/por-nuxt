// 百度统计
if(process.browser) {
    const HM_ID = '';

    if (HM_ID) {
        try {
            window._hmt = window._hmt || [];
    
            var hm = document.createElement("script");

            hm.src = `https://hm.baidu.com/hm.js?${HM_ID}`;
            var s = document.getElementsByTagName("script")[0]; 
            
            s.parentNode.insertBefore(hm, s);
        } catch (e) {
            // e
        }
    }
}
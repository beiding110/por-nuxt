import axios from 'axios';

const HOST_NAME = 'http://www.xxx.com';
const PAGE_SIZE = 50;

export default {
    hostname: HOST_NAME,
    cacheTime: 1000 * 60 * 60 * 3, // routes更新频率 1000 * 60 * 60 * 3
    gzip: true,
    defaults: {
        changefreq: 'always',
        lastmod: new Date(),
    },
    exclude: [
        '/user/**',
    ],
    // routes: async () => {
    //     var noticeList = [];

    //     try {
    //         let res = await axios.get(`${HOST_NAME}/tbez/tb/searchrelated/noticelist.json`, {
    //             params: {
    //                 sortname: 'publishtime',
    //                 pagesize: PAGE_SIZE,
    //                 pageindex: 1,
    //                 sortorder: 'desc',
    //             },
    //         });

    //         let {data} = res,
    //             {rows} = data;

    //         noticeList = rows.map(row => {
    //             return `/notice/${row.guid}`;
    //         });
    //     } catch(e) {
    //         console.log('sitemap notice list generate failed:' + e);
    //     }

    //     return [
    //         ...noticeList,
    //     ];
    // },
};

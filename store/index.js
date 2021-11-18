export const state = () => ({
    config: {
        nav: [
            {
                title: '首页',
                href: '/',
                activeReg: /(^\/search*)|(^\/$)/,
            },
            {
                title: '课程培训',
                href: '/class',
                click: `showMsgBox('课程培训即将开启，敬请期待！')`,
            },
        ],
        tel: '0311-xxxxxxx',
        email: 'xxxxx',
        workTime: '8:30-17:30',
        record: 'xxxxxxxxxx',
        address: 'xxxxx',
        products: [
            {
                title: 'xxxx',
                href: 'xxxxx'
            },
        ]
    }
})

export const mutations = {
    
}

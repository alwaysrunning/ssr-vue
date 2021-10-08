const HomeView = () => import('@views/home/HomeView.vue')
const header = () => import('@components/NewHeader.vue')
const footer = () => import('@components/NewFooter.vue')

module.exports =  [
    { path: '/', name: 'site', components: { default: HomeView, footer, header }, meta: { auth: false } },
]

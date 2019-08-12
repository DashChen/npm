import Test from './components/test'

const install = (Vue) => {
  Vue.component(Test.name, Test)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default { Test, install }
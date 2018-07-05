import VueAsyncComputed from './VueAsyncComputed';

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(VueAsyncComputed);
}

export default VueAsyncComputed;

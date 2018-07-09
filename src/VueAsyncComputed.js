import Function_cast from '/utils/Function/cast';
import Function_noop from '/utils/Function/noop';

let prefix = 'asyncComputed_';
let prefixPromise = prefix + 'promise_';
let prefixTrigger = prefix + 'trigger_';

export default {
	install(Vue) {
		Object.assign(Vue.config.optionMergeStrategies, {
			asyncComputed(toValue, fromValue) {
				return {...fromValue, ...toValue};
			},
		});
		Vue.mixin(this);
	},

	data() {
		let {$options} = this;
		let data = {};
		let {
			asyncComputed,
			computed,
		} = $options;
		if (asyncComputed) {
			Object.entries(asyncComputed).forEach(([key, {
				get: getValue,
				default: getDefaultValue,
				errorHandler = Function_noop,
			}]) => {
				getDefaultValue = Function_cast(getDefaultValue);
				let value;
				let firstCall = true;
				Object.assign(computed, {
					[prefixPromise + key]() {
						if (firstCall) {
							firstCall = false;
							value = getDefaultValue.call(this);
						}
						Promise
							.try(() => getValue.call(this))
							.then(newValue => {
								value = newValue;
								this[prefixTrigger + key] = {};
							})
							.catch(error => {
								errorHandler.call(this, error);
							});
					},
					[key]() {
						this[prefixPromise + key];
						this[prefixTrigger + key];
						return value;
					},
				});
				data[prefixTrigger + key] = {};
			});
		}
		return data;
	},

	computed: {},
};

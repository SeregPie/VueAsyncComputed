//import Function_cast from '/utils/Function/cast';
import Function_constant from '/utils/Function/constant ';

let prefix = 'asyncComputed_';
let prefixPromise = prefix + 'promise_';
let prefixTrigger = prefix + 'trigger_';

export default {
	install(Vue) {
		Vue.config.optionMergeStrategies.asyncComputed = function(toValue, fromValue) {
			return {...fromValue, ...toValue};
		};
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
				computed[prefixPromise + key] = function() {
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
						.catch(errorHandler);
				};
				data[prefixTrigger + key] = {};
				computed[key] = function() {
					this[prefixPromise + key];
					this[prefixTrigger + key];
					return value;
				};
			});
		}
		return data;
	},

	computed: {},
};

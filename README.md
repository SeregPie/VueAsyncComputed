# VueAsyncComputed

Async computed properties.

## demo

[Try it out!](https://seregpie.github.io/VueAsyncComputed/)

## dependencies

- [Vue](https://github.com/vuejs/vue)

## setup

### npm

```shell
npm install @seregpie/vueasynccomputed
```

### ES module

Install the plugin globally.

```javascript
import Vue from 'vue';
import VueAsyncComputed from '@seregpie/vueasynccomputed';

Vue.use(VueAsyncComputed);
```

*or*

Register the plugin in the scope of another instance.

```javascript
import VueAsyncComputed from '@seregpie/vueasynccomputed';

export default {
  // ...
  mixins: [VueAsyncComputed],
};
```

### browser

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/@seregpie/vueasynccomputed"></script>
```

If Vue is detected, the plugin will be installed automatically.

## usage

```javascript
{
  props: {
    itemId: Number,
  },
  asyncComputed: {
    item: {
      get() {
        return axios.get(`/api/items/${this.itemId}`);
      },
      default: null,
      errorHandler(error) {
        this.displayErrorMessage(error.message);
      },
    },
  },
}
```

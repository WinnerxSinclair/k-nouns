// v-autosize.js
import { nextTick } from 'vue'

const MAX = 325

function resize (el) {
  el.style.height = 'auto'            // reset
  const h = el.scrollHeight
  el.style.overflow = h > MAX ? 'auto' : 'hidden'
  el.style.height   = (h > MAX ? MAX : h) + 'px'
}

export default {
  // binding.value === current text when we pass it in the template
  mounted (el) {
    nextTick(() => resize(el))        // wait until v-model sets the value
    el.addEventListener('input', () => resize(el))
  },
  updated (el) { 
    nextTick(() => resize(el))      // run after the new value has rendered
  }
}

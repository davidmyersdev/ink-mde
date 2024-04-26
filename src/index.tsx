import { computed, ref } from '@vue/reactivity'
import { createElement } from '/lib/jsx'

const SomeChild = () => {
  const random = ref(Math.random())
  const double = computed(() => random.value * 2)

  setTimeout(() => {
    random.value = Math.random()
  }, 2000)

  return (
    <div>{double.value}</div>
  )
}

const SomeEl = () => {
  const random = ref(Math.random())
  const double = computed(() => random.value * 2)
  const something = 'something'

  return (
    <div class="ink-mde-toolbar">
      <div>{double.value}</div>
      <SomeChild some-thing={something} />
    </div>
  )
}

// if (import.meta.env.VITE_SSR) {
//   console.log(createString(el))
// } else {
//   console.log(createElement(el))
// }

document.body.append(createElement(<SomeEl />))
// document.body.append(<SomeEl />)

// render(SomeEl, document.body)

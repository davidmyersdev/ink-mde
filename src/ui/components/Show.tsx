import van from 'vanjs-core'

// eslint-disable-next-line solid/no-destructure
export const Show = (props: { children: any, when: () => boolean }) => {
  console.log('Show')
  const isShowing = van.derive(() => {
    const val = props.when()

    console.log('isShowing', val)

    return val
  })

  return van.derive(() => {
    const children = props.children
    const template = <template />

    console.log('children', children)

    return isShowing.val ? children : template
  })
}

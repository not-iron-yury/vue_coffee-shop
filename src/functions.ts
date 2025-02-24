const htmlElement = document.documentElement
const htmlElementClasses = htmlElement.classList

export const getScrollbarWidth = (): number => {
  return window.innerWidth - document.documentElement.clientWidth
}

export const addOverflowHidden = (size: number): void => {
  htmlElementClasses.add('hidden')
  document.body.style.paddingRight = `${size}px`
}

export const removeOverflowHidden = (): void => {
  htmlElementClasses.remove('hidden')
  document.body.style.paddingRight = ''
}

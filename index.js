const wrapper = document.querySelector('.wrapper')

function getDocumentHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  )
}

let documentHeight = getDocumentHeight()

let fC = 0
let totalC

const req = async url => {
  if (fC * 10 === +totalC) {
    return
  }
  fC++
  fetching = true
  const response = await fetch(`${url}?_limit=10&_page=${page}`)
  const body = await response.json()
  totalC = response.headers.get('x-total-count')
  return body
}

function render(body) {
  if (!body) return
  const fragment = document.createDocumentFragment()
  body.forEach(({ id, body: aa }) => {
    const div = document.createElement('div')
    div.innerHTML = `<div>${id}</div> <div>${aa}</div>`
    fragment.appendChild(div)
  })
  return fragment
}

let page = 1

let fetching = false

const load = () => {
  if (fetching) {
    return
  }

  req(`https://jsonplaceholder.typicode.com/posts`, page)
    .then(render)
    .then(fragment => {
      if (!fragment) return
      wrapper.appendChild(fragment)
      page++
      fetching = false
      scrollHeight = documentHeight = getDocumentHeight()
    })
}

window.addEventListener('scroll', () => {
  if (
    100 >
    documentHeight - (pageYOffset + document.documentElement.clientHeight)
  ) {
    load()
  }
})

import Plugin from '@swup/plugin'

export class SwupCorePlugin extends Plugin {
  isSwupPlugin = true

  name = 'SwupCorePlugin'

  requires = { swup: '>=4' }

  mount() {
    document.addEventListener('click', this.handleNoSwupClick.bind(this))

    this.swup.options = {
      ...this.swup.options,
      ignoreVisit: (url, { el }) => el?.closest('[data-no-swup], [data-naja]'),
      animationSelector: '.view-transition-main',
    }

    this.swup.hooks.before('scroll:top', this.handleScrollTop.bind(this))
    this.swup.hooks.on('content:replace', this.handleContentReplace.bind(this))
    this.swup.hooks.on('cache:set', this.handleCacheSet.bind(this))
    this.swup.hooks.before('page:load', this.handlePageLoad.bind(this))
  }

  unmount() {
    document.removeEventListener('click', this.handleNoSwupClick)
  }

  handleScrollTop(visit, { options }) {
    if (visit.from.url !== visit.to.url) (options.behavior = 'instant')
  }

  handleContentReplace(visit) {
    const content = visit.to.document

    content.querySelectorAll('[data-swup-replace]').forEach((element) => {
      const replaceElement = document.querySelector(`[data-swup-replace="${element.dataset.swupReplace}"]`)
      const placement = element.closest('head') ? document.head : replaceElement.parentElement

      replaceElement ? (replaceElement.outerHTML = element.outerHTML) : placement.insertAdjacentHTML('beforeend', element.outerHTML)
    })

    this.handleConversion()
  }

  /** @var {Array} dataLayer */
  handleConversion() {
    window.dataLayer && window.dataLayer.push({
      event: 'page_view',
    })
  }

  handleCacheSet(visit, { page }) {
    this.swup.cache.update(page.url, { created: Date.now(), ttl: 1000 * 60 })
  }

  handlePageLoad() {
    // noinspection JSCheckFunctionSignatures
    this.swup.cache.prune((url, { created, ttl }) => Date.now() > created + ttl)
  }

  handleNoSwupClick({ target }) {
    const noSwup = target.closest('[data-no-swup]')

    if (!noSwup) return

    if (noSwup.classList.contains('x-button')) {
      noSwup.dataset.loading = ''
    }
    else {
      noSwup.style.cursor = 'wait'
    }
  }
}

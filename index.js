import Plugin from '@swup/plugin'

export class SwupNewlogicDigitalPlugin extends Plugin {
    name = 'SwupNewlogicDigitalPlugin'

    requires = { swup: '>=4' }

    defaults = {
        ignoreVisit: (url, { el }) => el?.closest('[data-no-swup], [data-naja]'),
        animationSelector: '.swup-transition'
    }

    constructor(options = {}) {
        super()

        /* Merge default options and user options */
        this.options = { ...this.defaults, options }
    }

    mount() {
        document.addEventListener('click', this.handleNoSwupClick.bind(this))

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

    /** @var {Array} dataLayer */
    /** @var {Function} rc */
    /** @var {Function} retargetingHit */
    /** @var {Function} conversionHit */
    /** @var {Object} retargetingConf */
    /** @var {Object} conversionConf */
    /** @var {Function} fbq */
    handleContentReplace(visit, { page }) {
        const content = new DOMParser().parseFromString(page.html, 'text/html')

        content.querySelectorAll('[data-swup-replace]').forEach((element) => {
            const replaceElement = document.querySelector(`[data-swup-replace="${element.dataset.libReplaceTag}"]`)
            const placement = element.closest('head') ? document.head : replaceElement.parentElement

            replaceElement ? (replaceElement.outerHTML = element.outerHTML) : placement.insertAdjacentHTML('beforeend', element.outerHTML)
        })

        window.dataLayer && window.dataLayer.push({
            event: 'page_view'
        })

        window.rc?.retargetingHit && window.rc.retargetingHit(window.retargetingConf ?? {})
        window.rc?.conversionHit && window.rc.conversionHit(window.conversionConf ?? {})

        window.fbq && window.fbq('track', 'PageView')
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

        if (noSwup.classList.contains('button')) {
            noSwup.classList.add('loading')
        } else {
            noSwup.classList.add('cursor-wait')
        }
    }
}

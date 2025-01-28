# Swup Plugins

## Usage

```javascript
import { SwupCorePlugin } from '@newlogic-digital/swup-plugins'

new Swup({
    plugins: [new SwupCorePlugin()]
})
```

## Info
### SwupCorePlugin

#### 1. Adds default options

```javascript
{
    ignoreVisit: (url, { el }) => el?.closest('[data-no-swup], [data-naja]'),
    animationSelector: '.view-transition-main'
}
```

#### 2. Adds support for `data-swup-replace` attribute, replaces attribute upon content replace

```html
<meta name="description" content="Replace me" data-swup-replace>
```

#### 3. Scroll is restored to top upon navigation

#### 4. Adds default gtag page_view event to dataLayer upon navigation

#### 5. Adds `data-loading` attribute to x-button or spinner cursor upon no-swup navigation

#### 6. Prunes cache after 1 minute
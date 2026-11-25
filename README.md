# Shopgate Connect - configurable banner

Adds one or multiple banners to top or bottom of the pages. A banner can be an image, text or text with background image. Linking is possible.

## Features
- Multiple banners per page
- Can be added to all pages from one type or only specific ones based on the IDs in `Ids`
- Supports HTML as content
- Linking
- Background images, colors, gradients
- Fetch banners config from external endpoint

## Requirements
- Shopgate PWA 7.35.0 or later

## Demo & Examples
[See here](demo/index.md)

## Configuration

_Please make sure your images are compressed and optimized to reduce the loadtime_

### banners (Array)
Set it to `null` to cause requests configEndpoint url

- `routePattern (string)`: Pattern of the route where the banner should be shown. Use `*` to add it to all routes.
Examples: `/category/:categoryId`, `/item/:productId`, `/category`, `/`, `/cart`, `/page/:pageId`

- `ids (Array)` (optional): Array of Ids for the provided pattern. If omitted it's a wildcard for every Id. For CMS routes using slug-based URLs (e.g. `/page/shipping-information`), this array should contain the expected page key instead of Ids, e.g. `["shipping-information"]`.

- `position (string)` (optional): Position where the banner should be shown. Available positions `top` (default), `bottom`, `topmost`

- `hideOnScroll (boolean)` (optional): If true, the banner hides once the page is scrolled down
past the scroll offset of the theme (100 px by default) and shows again when the page is scrolled
back above it. The page content keeps the
space of the banner at its top, so it doesn't move when the banner hides or shows.
Default is `false`. Only works if `position` is `topmost`.

- `fillStatusBar (boolean)` (optional): If true, the banner reaches into the status bar area, so the
status bar shows the color of the banner instead of the header color. Default is `false`. Only works
for the first banner with `position` `topmost`, and only for a text banner or a wrapped image
(`imageWrappedUrl`) whose background is a plain color (`cssBackground` or a background color in
`wrapperStyles`, no image or gradient).
The app picks light or dark status bar icons from the header color, not from the banner. Choose a
banner color with the same brightness as the header: a dark banner under a dark header, a light
banner under a light header. Check the result in the app on iOS and Android.

- Banners with `position` `top` on pages with the floating header (PWA 7.34 and later) start below
the header and the search bar. When the first of them is a text banner or a wrapped image with a
plain background color, that color fills the space behind the header, so the logo and the header
buttons stand on the banner color. Choose a banner color that the logo and the buttons are readable
on.

- `link (string)` (optional): Link to the page that should be opened. Relative urls will be opened in the app. Absolute in inAppBrowser

- `content (Object)`: Object for the content for the banner. It can look like option A, B or C.

- `wrapperStyles (Object)` (optional): CSS-in-JS style object (camelCase properties; pseudo classes and media queries as nested keys) that gets applied to the wrapper around the banner

- `productSliderIds (Array)` (optional): Array of productsIds for ProductSlider.
Example:
```json
{
  "productSliderIds": [
    "166",
    "640",
    "850"
  ]
}
```

- `slides (Array)` (optional): Array of slides. Each entry represents a slide with same settings for a banner as above. So link, content, wrapperStyles.

Example:
```json
{
  "slides": [
    {
      "content": {
        "cssBackground": "#000",
        "h2": "My headline text </br>",
        "h3": "With a subheadline",
        "textColor": "white"
      },
      "wrapperStyles": {
        "margin": "20px"
      },
      "link": "/cart"
    },
    {
      "content": {
        "imageOnlyUrl": "https://cdn.img.com/image1.jpg",
        "altText": "Description of the image for screen readers"
      },
      "wrapperStyles": {
        "margin": "10px"
      },
      "link": "/foo"
    },
    {
      "content": {
        "cssBackground": "#000",
        "imageWrappedUrl": "https://cdn.img.com/image1.jpg",
        "altText": "Description of the image for screen readers"
      },
      "wrapperStyles": {
        "height": "100%",
        "display": "flex",
        "justifyContent": "center"
      },
      "link": "/foo"
    }
  ]
}
```

- `sliderSettings (Object)` (optional): Settings for slider
- see https://swiperjs.com/swiper-api#parameters for possible slider parameters

Example:
```json
{
  "sliderSettings": {
    "autoPlay": false,
    "controls": true,
    "indicators": true,
    "loop": false,
    "slidesPerView": 1,
    "freeMode": false,
    "autoHeight": true,
    "allowTouchMove": true,
    "style": {
      "marginBottom": 10
    }
  }
}
```

**Option A**

- `imageOnlyUrl (string)`: Url of the image that should be shown
- `altText (string)`: A descriptive text for the image, providing context for screen readers to improve accessibility for visually impaired users.

Example:
```json
{
  "content": {
    "imageOnlyUrl": "https://cdn.img.com/image1.jpg",
    "altText": "Description of the image for screen readers"
  }
}
```

**Option B**

- `imageWrappedUrl (string)`: Url of the image that should be shown. Image is wrapped with a container that
can be styled via `wrapperStyles` object.
- `altText (string)`: A descriptive text for the image, providing context for screen readers to improve accessibility for visually impaired users.

Example:
```json
{
  "content": {
    "imageWrappedUrl": "https://cdn.img.com/image1.jpg",
    "altText": "Description of the image for screen readers"
  },
  "wrapperStyles": {
    "height": "100%",
    "display": "flex",
    "justifyContent": "center"
  }
}
```

**Option C**

- `h2` (optional): Headline H2 of the header. You can use html markup here like `<br>` to force a line break.
- `h3` (optional): Headline H3 of the header. You can use html markup here like `<br>` to force a line break
- `cssBackground` (optional): CSS value for the background property of the header (e.g `#fff`, `url("header.png")`)
- `textColor` (optional): Color of the text in the Banner

Example:
```json
{
  "content": {
    "cssBackground": "#000",
    "textColor": "#fff",
    "h2": "Line <strong>1</strong>",
    "h3": "Line 2"
  }
}
```

### configEndpoint (string)
Endpoint URL to fetch banners configuration from. Endpoint should return json in a form like this:
```json
{
   "banners": [
      {
          "routePattern": "/category/:categoryId",
          "ids": [
            "671"
          ],
          "content": {
            "cssBackground": "#000",
            "h2": "My headline text </br>",
            "h3": "With a subheadline",
            "textColor": "white"
          }
      }
   ]
 }
```

### configTTL (number)
TTL in seconds for the fetched banner config

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

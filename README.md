# Shopgate Connect - configurable banner

Adds one or multiple banners to top or bottom of the pages. A banner can be an image, text or text with background image. Linking is possible.

## Features
- Multiple banners per page
- Can be added to all pages from one type or only specific ones based on the IDs in `Ids`
- Supports HTML as content
- Linking
- Background images, colors, gradients
- Fetch banners config from external endpoint

## Demo & Examples
[See here](demo/index.md)

## Configuration

_Please make sure your images are compressed and optimized to reduce the loadtime_

### banners (Array)
Set it to `null` to cause requests configEndpoint url

- `routePattern (string)`: Pattern of the route where the banner should be shown. Use `*` to add it to all routes.
Examples: `/category/:categoryId`, `/item/:productId`, `/category`, `/`, `/cart`

- `ids (Array)` (optional): Array of Ids for the provided pattern. If omitted it's a wildcard for every Id.

- `position (string)` (optional): Position where the banner should be shown. Available positions `top` (default), `bottom`, `topmost`

- `link (string)` (optional): Link to the page that should be opened. Relative urls will be opened in the app. Absolute in inAppBrowser

- `content (Object)`: Object for the content for the banner. It can look like option A or B

- `wrapperStyles (Object)` (optional): css glamor style object that gets applied to wrapper around the banner

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
        "imageOnlyUrl": "https://cdn.img.com/image1.jpg"
      },
      "wrapperStyles": {
        "margin": "10px"
      },
      "link": "/foo"
    }
  ]
}
```

- `sliderSettings (Object)` (optional): Settings for slider

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
    "direction": "vertical",
    "autoHeight": true,
    "style": {
      "marginBottom": 10
    }
  }
}
```

**Option A**

- `imageOnlyUrl (string)`: Url of the image that should be shown

Example:
```json
{
  "content": {
    "imageOnlyUrl": "https://cdn.img.com/image1.jpg"
  }
}
```

**Option B**

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

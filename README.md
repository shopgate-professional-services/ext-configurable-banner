# Shopgate Connect - configurable banner

Adds Banner to the top of pages. A banner can be an image, text or text with background image. Linking is possible.

## Configuration

_Please make sure your images are compressed and optimized to reduce the loadtime_

### banners

`routePatterns (string)`: Pattern of the route where the banner should be shown. 
Examples: `/category/:categoryId`, `/item/:productId`, `/category`, `/`, `/cart` 

`ids (Array)` (optional): Array of Ids for the provided pattern. If omitted it's a wildcard for every Id.

`link (string)` (optional): Link to the page that should be opened. Relativ urls will be opned in the app. Absolut in inAppBrowser

`content (Object)`: Object for the content for the banner. It can look like option A or B

**Option A**

`imageOnlyUrl (string)`: Url of the image that should be shown

Example:
`
"content": {
   "imageOnlyUrl": "https://cdn.img.com/image1.jpg"
}
`

**Option B**

`h2` (optional): Headline H2 of the header. You can use html markup here like <br> to force a line break.
`h3` (optional): Headline H3 of the header. You can use html markup here like <br> to force a line break
`cssBackground` (optional): CSS value for the background property of the header (e.g `#fff`, `url("header.png")`)
`textColor` (optional): Color of the text in the Banner

Example:
`"content": {
   "cssBackground": "#000",
   "textColor": "#fff"
   "h2": "Line <strong>1</strong>",
   "h3": "Line 2",
}`


## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

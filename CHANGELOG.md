# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0-beta.1] 2026-11-25
### Changed
- **Breaking:** requires PWA 7.35.0 or later for `useViewScroll` (`peerDependencies`: `@shopgate/engage` `>=7.35.0-beta.4`, so the 7.35.0 betas work too).
- New option `fillStatusBar` for the first banner with position `topmost` (off by default): a text banner or wrapped image with a plain background color (`cssBackground` or a background color in `wrapperStyles`) reaches into the status bar area, so the status bar takes the color of the banner. The banner color also fills side margins and rounded corners of that banner. Banners without the option, without a background color or with a background image or gradient anywhere, image only banners, sliders and product sliders start below the status bar.
- Frontend tooling updated to the PWA 7.33.2 setup (ESLint 8, `@shopgate/eslint-config` 7.33, tracked lockfile, no own Babel config). No runtime change.
- Styles use `makeStyles`, `css` and `injectGlobal` from `@shopgate/engage/styles` instead of glamor. `wrapperStyles` keep the same format.
- Position `top`: on pages with the floating header of PWA 7.34 the banners start below the header and the search bar. When the first banner has a plain background color, that color fills the space behind the header. The space for the search bar stays while the bar hides on scroll, so the content does not move.
### Fixed
- The height of a banner with `hideOnScroll` is measured again when the banner resizes or renders later. Each of several banners with `hideOnScroll` frees its own height, so banners of different heights hide without leaving a gap.
- A banner with `hideOnScroll` hides and shows reliably at any scroll speed. It follows the scroll position of the view once per frame with `useViewScroll` of the PWA, the same way the header and the search bar do (hidden past the scroll offset of the theme, 100 px by default), instead of the throttled scroll events of `ScrollHeader`, which missed fast scrolling to the bottom and the last scroll event at the top.
- A banner with `hideOnScroll` no longer makes the page jump on iOS when it hides or shows. The page content keeps the space of the banner at its top and lies under the banner, so the scroll area of the page stays in place while the banner slides away. The header slides up with a transform instead of changing its height, so it moves smoothly, the same way the search bar of PWA 7.34 hides. Scrolling up, the banner is back before the page reaches the top, so it does not appear while iOS bounces there.
- `wrapperStyles` always win over the default styles of text banners.

## 1.6.1 2025-06-20
### Changed
- Banners on `topmost` position with `hideOnScroll` active are not shown till user scrolled back to top again

## [1.6.0] 2025-06-18
### Added
- Add "hideOnScroll" option to config, which hides the topmost banner when the user scrolls down (needs PWA >= 7.27.2)
### Fixed
- Fixed banner matching for CMS page routes using slug-based parameters

## [1.5.0] 2025-02-28
### Added
- Improved accessibility: made link in banner accessible to screen readers

## [1.4.1] 2025-02-03
### Added
- Introduced new `imageWrappedUrl` property for the `content` section of slides. It accepts an image url as
value and wraps the image tag with a div container that can be styled via `wrapperStyles`.
### Changed
- Changed portal position for "topmost" position of the banner (needs PWA >= 7.23.6)

## [1.4.0] 2025-01-29
### Added
- topmost position for banner
- support for vertical scrolling

## [1.3.2] 2022-06-09
- Fixed bug where top banner was positioned top and bottom

## [1.3.0] 2021-02-02
### Added
- `position` to config

## [1.2.0] 2020-08-05
### Added
- ProductSlider support
- Slider support
- Config to add styling to wrapper

## [1.1.0] 2020-05-20
### Added
- possibility to fetch banners config from endpoint

## [1.0.0] 2019-10-07
- initial release

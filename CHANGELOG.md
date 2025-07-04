# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

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

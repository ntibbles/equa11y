# Equa11y: Accessibility Testing Utilities
The Equa11y extension is to help test a webpage for accessibility. It is designed to improve the efficiency of accessibility testing with various utilities.

## What's New in Version 1.4!
### Enhancements
- **Tabbing Order** - Now highlights elements with a `tabIndex` greater than 0.
- **Stop Animations** - Now stops animations in iframes.
- **Reveal Viewport Tag** - Now detects if pinch to zoom is disabled.
- **Text Spacing** - Now adjusts paragraph spacing.
- **Text Zoom** - Stability Updates
- **Display Alt Text** - Now reveals when the alt attribute is missing
- **Display Heading Levels** - Now account for the use of 'aria-level' and dynamic headings that are added/removed from the page 
- **Display Screen Reader Text** - Now prioritizes `aria-label`, `aria-labelledby`, and `aria-describedby` attributes.

### UI
- All utilities are now broken into tabs by WCAG (Web Content Accessibility Guideline) principle:
- Perceivable
- Operable
- Understandable
- Robust

And includes the success criteria for each test.

**Settings** page allows you to do the following:
- Set Dark Mode
- Hide the beta utilities
- Change the list of exclusive words
- Increase the font size of the extension

## Core Utilities
- **Display Alt Text** - Outlines and labels images with their alternative text. If an image is missing an `alt` attribute, a label indicating "missing alt attribute" is displayed with a red background and a black dashed outline.
- **Display Landmark Regions** - Outlines and labels landmark regions with their role and label.
- **Display Element Roles** - Outlines and labels interactive elements with their role.
- **Display Heading Levels** - Outlines and labels all headings on the page. If a heading level is skipped (e.g., an H3 follows an H1), the label for the skipped heading will be displayed with a red background and a black dashed outline.
- **Reveal Viewport Tag** - Displays the viewport tag. If the viewport tag is present but prevents pinch-to-zoom (i.e., contains `user-scalable=no` or `maximum-scale=1`), the displayed label will have a red background and a black dashed outline.
- **Zoom Text 200%** - Zooms text-only on the page by 200%. It calculates and applies new font sizes and line heights based on a user-selected zoom level, injecting these styles with `!important` to override existing page styles. It also displays a label showing the current zoom percentage.
- **Display Target Size** - Displays the current target size of an interactive element. If either the width or height of an interactive element is less than 24 pixels, the label will be displayed with a red background and a black dashed outline.
- **Display Screen Reader Text** - Displays the hidden text that a screen reader would announce. It prioritizes `aria-label`, `aria-labelledby`, and `aria-describedby` attributes. If these are not present, it falls back to the element's `textContent`.
- **Highlight Exclusive Text** - Scans the page for exclusive words (e.g - "See", "View", etc) and highlights them. You can also modify the list in the **NEW** "settings" page.
- **Reveal Lang Attribute** - Displays the lang attribute for the page and any in-page elements. If the `<html>` tag is missing a `lang` attribute, a message "No lang attribute on HTML tag." is displayed at the top of the page.
- **Text Spacing** - Adjusts line height, word spacing, letter spacing, and paragraph spacing according to WCAG 2.1 AA guidelines by injecting CSS rules. It calculates these values dynamically based on the page's base font size.
- **Tabbing Order** - Outlines and labels all tabbable elements on the page. If an element has a `tabIndex` greater than 0 (indicating a non-sequential tab order), its label will be displayed with a red background and a black dashed outline.
- **Stop Animations** - Provides comprehensive control over motion on a webpage. It stops animated GIFs by replacing them with their first static frame, disables CSS animations and transitions by injecting overriding styles, pauses all video elements, and attempts to stop motion within same-origin iframes (or hides cross-origin iframes).

### Core Utility Limitations
- **Zoom Text 200%** detects and inserts a new stylesheet that doubles the current font size. If the page contains elements with styles including !important, the text will not zoom.

## Beta Utilities
- **Outline Embedded Text** - Scans all images on the page and attempts to determine if the image has embedded text. If embedded text is found, the image is outlined with a blue border and a label "Embedded text" is added.
- **Outline Event Listeners** - Outlines and labels all non-interactive elements in the page with events. This is useful for identifying elements that may not get keyboard or screen reader focus. 

### Beta Utility Limitations
- **Outline Embedded Text** grayscales images and uses Tesseract to read the text. If the server prevents a reload of the images the graysacle will fail, reducing the accuracy of Tesseract. Make sure all images are loaded BEFORE running the utility. NOTE: Occasionally, the content script to load Tesseract doesn't load into the page. Refresh the page and try again. An issue has been logged: <a href="https://github.com/ntibbles/equa11y/issues/25">https://github.com/ntibbles/equa11y/issues/25</a>

- **Outline Event Listeners** outlines non-interactive elements that have events bound to them. This utility uses Chromes Debug mode. Any limitations on the browser using debug mode (i.e. cancelling debug mode) will affect the functionality.

## Why is a utility 'Not Available'
The extension checks if the site can run some of the utilities during initialization. If something fails, the utility is 'Not Available'.

## Loading an unpacked extension
To load an unpacked extension in developer mode:

1. Go to the Extensions page by entering chrome://extensions in a new tab. (By design chrome:// URLs are not linkable.)
    - Alternatively, click the Extensions menu puzzle button and select Manage Extensions at the bottom of the menu.
    - Or, click the Chrome menu, hover over More Tools, then select Extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the extension directory.

Voila! 

## CHANGELOG

### Version 1.4
[Enhancements]
- [Tabbing Order now highlights elements with a `tabIndex` greater than 0](https://github.com/ntibbles/equa11y/issues/90)
- [Stop Animations now stops animations in iframes](https://github.com/ntibbles/equa11y/issues/91)
- [Pinch to Zoom now detects if pinch to zoom is disabled](https://github.com/ntibbles/equa11y/issues/92)
- [Text Spacing now adjusts paragraph spacing](https://github.com/ntibbles/equa11y/issues/93)
- [Text Zoom now uses a slider for more granular control](https://github.com/ntibbles/equa11y/issues/75)
- [Display Alt Text now reveals when the alt attribute is missing](https://github.com/ntibbles/equa11y/issues/88)
- [Display Headings Levels now account for the use of 'aria-level' and dynamic headings that added/removed from the page](https://github.com/ntibbles/equa11y/issues/89)
- [Display Screen Reader Text now prioritizes `aria-label`, `aria-labelledby`, and `aria-describedby` attributes.](https://github.com/ntibbles/equa11y/issues/87)

[Bugfixes]
- [Display SR Text fails with empty attributes](https://github.com/ntibbles/equa11y/issues/87)

### Version 1.3
[Enhancements]
- [Display Headings Levels now account for the use of 'aria-level' and dynamic headings that added/removed from the page](https://github.com/ntibbles/equa11y/issues/89)
- [Display Headings Levels now account for dynamic headings that added/removed from the page](https://github.com/ntibbles/equa11y/issues/85)
- [Display Alt Text now reveals when the alt attribute is missing](https://github.com/ntibbles/equa11y/issues/88)

[Bugfixes]
- [Display SR Text fails with empty attributes](https://github.com/ntibbles/equa11y/issues/87)

### Version 1.2
[Enhancements]
- [#62 - Added 'Text Spacing' utility](https://github.com/ntibbles/equa11y/issues/62)
- [#63 - Added 'Reveal Page Title' utility](https://github.com/ntibbles/equa11y/issues/63)
- [#75 - Added slider to text zoom](https://github.com/ntibbles/equa11y/issues/75)

### Version 1.1.1 
[Bugfixes]
- [#25 - Tesseract doesn't load](https://github.com/ntibbles/equa11y/issues/25)
- [#73 - Zoom text headings](https://github.com/ntibbles/equa11y/issues/73)

### Version 1.1
[Enhancements]
- [#1 - Display Screen Reader Text](https://github.com/ntibbles/equa11y/issues/1)
- [#3 - Highlight Exclusive Text](https://github.com/ntibbles/equa11y/issues/3)
- [#30 - Display Target Size](https://github.com/ntibbles/equa11y/issues/30)
- [#31 - Split utils over POUR tabs](https://github.com/ntibbles/equa11y/issues/31)
- [#32 - Reveal Lang Attribute](https://github.com/ntibbles/equa11y/issues/32)
- [#47 - Add settings screen](https://github.com/ntibbles/equa11y/issues/47)
- [#60 - Add font size to settings](https://github.com/ntibbles/equa11y/issues/60
)
- Dark Mode added to settings
- Hide Utils in settings

## Contributors
Gabby Alcantara
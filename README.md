# Equa11y: Accessibility Testing Utilities
The Equa11y extension is to help test a webpage for accessibility. It is designed to improve the efficiency of accessibility testing with various utilities.

## What's New in Version 1.2!
### New Functionality
- **Text Spacing** - Increase the text spacing on the page.
- **Reveal Pagae Title** - Displays the page title of the page.
- **Text Zoom Control** - Adjust the text zoom from 100 - 200%.

### UI
All utilities are now broken into tabs by WCAG (Web Content Accessibility Guideline) principle:
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
- **Display Alt Text** - Outlines and labels images with their alternative text.
- **Display Landmark Regions** - Outlines and labels landmark regions with there role and label.
- **Display Element Roles** - Outlines and labels interactive elements with their role.
- **Display Heading Levels** - Outlines and labels all headings on the page.
- **Reveal Viewport Tag** - Displays the viewport tag.
- **Zoom Text 200%** - Zooms text-only on the page by 200%.
- **Display Target Size** - Displays the current target size of an interactive element.
- **Display Screen Reader Text** - Displays the hidden text that a screen reader would announce. It takes into consideration the precedence of aria-label, aria-labelledby, and aria-describedby.
- **Highlight Exclusive Text** - Scans the page for exclusive words (e.g - "See", "View", etc) and highlights them. You can also modify the list in the **NEW** "settings" page.
- **Reveal Lang Attribute** - Displays the lang attribute for the pagae and any in-page elements.

### Core Utility Limitations
- **Zoom Text 200%** detects and inserts a new stylesheet that doubles the current font size. If the page contains elements with styles including !important, the text will not zoom.

## Beta Utilities
- **Outline Embedded Text** - Scans all images on the page and attempts to determine if the image has embedded text.
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
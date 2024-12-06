# Equa11y: Accessibility Testing Utilities
The Equa11y extension is to help test a webpage for accessibility. It is designed to improve the efficiency of accessibility testing with various utilities.

## Core Utilities
- **Display Alt Text** - Outlines and labels images with their alternative text.
- **Display Landmark Regions** - Outlines and labels landmark regions with there role and label.
- **Display Element Roles** - Outlines and labels interactive elements with their role.
- **Display Heading Levels** - Outlines and labels all headings on the page.
- **Reveal Viewport Tag** - Displays the viewport tag.
- **Zoom Text 200%** - Zooms text-only on the page by 200%.

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

Clickety Click—Barba Trick! 

## Contributors
Gabby Alcantara
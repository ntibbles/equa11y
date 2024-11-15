# Assistive Technology Testing Tools (AT3)
Assistive Technology Testing Tools is a Chrome extensions with a set of utilies intended to help test a page for accessibility. It's primary purpose is to speed up testing for Accessibility Indicator Data Score testing. 

## Core Utilities
- Display Alt Text - Outlines and labels images with their alternative text.
- Display Landmark Regions - Outlines and labels landmark regions with there role and label.
- Display Element Roles - Outlines and labels interactive elements with their role.
- Reveal Viewport Tag - Displays the viewport tag.
- Display Headings - Outlines and labels all headings on the page.
- Zoom Text 200% - Zooms text-only on the page by 200%.

### Core Utility Limitations
- Zoom Text 200% detects and inserts a new stylesheet that doubles the current font size. If the page contains elements with styles including !important, the text will not zoom.

## Experimental Utilities
- Outline Embedded Text - Scans all images on the page and attempts to determine if the image has embedded text.
- Outline Event Listeners - Outlines and labels all non-interactive elements in the pages.

### Experimental Utility Limitations
- Outline Embedded Text grayscales images and uses Tesseract to read the text. If the server prevents a reload of the images the graysacle will fail, reducing the accuracy of Tesseract. 
- Outline Event Listeners uses Chromes Debug mode. Any limitaions on the browser using debug mode (i.e. cancelling debug mode) will affect the functionality.

## Loading an unpacked extension
To load an unpacked extension in developer mode:

1. Go to the Extensions page by entering chrome://extensions in a new tab. (By design chrome:// URLs are not linkable.)
    - Alternatively, click the Extensions menu puzzle button and select Manage Extensions at the bottom of the menu.
    - Or, click the Chrome menu, hover over More Tools, then select Extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the extension directory.

Ta-da! The extension has been successfully installed. If no extension icons were included in the manifest, a generic icon will be created for the extension.

## Contributors
Gabby Alcantara
# Accessibility

We need calypso to be accessible to all our users. According to surveys done by WebAIM,

- 97.6% of screen reader users… [(2014)](http://webaim.org/projects/screenreadersurvey5/#javascript)
- 99.5% of users with low vision… [(2013)](http://webaim.org/projects/lowvisionsurvey/#javascript)
- 100% of users with motor disabilities… [(2013)](http://webaim.org/projects/motordisabilitysurvey/#javascript)

… use the internet with javascript enabled. These users can use Calypso if we make sure it's accessible and works with assistive technology.

For us, accessible means:

- There are text alternatives for non-text content (videos, images, audio, interactive elements like charts).
- Content can be accessed in different ways, from a computer, phone, or assistive technology, without losing meaning.
- All functionality is available using a keyboard.
- Users have enough time to read and react to content.
- Content is clearly outlined and well-labeled, so that users always know where they are and how to find what they want.
- Content is always localized, and the language of the page and sections are clearly labelled.
- We use labels and accessible notifications to let users know about errors and how to correct them.
- [We don't cause seizures](https://www.w3.org/WAI/WCAG20/quickref/#seizure) with animations or flashing notifications.
- We do all this within markup standards and best practices to ensure future compatibility.

— (paraphrased from the [WCAG 2.0 Overview](https://www.w3.org/WAI/WCAG20/glance/Overview))

For a detailed list of requirements, you can go to [the WCAG 2.0 customized quickref](https://www.w3.org/WAI/WCAG20/quickref/?currentsidebar=%23col_customize&levels=aaa&technologies=smil%2Cpdf%2Cflash%2Csl). There are 3 levels of criteria for each guideline, A (lowest), AA, and AAA (highest). For Calypso, we aim for WCAG 2.0 Level AA (which also includes level A). This is generally an agreed-on standard for compliance with equal access laws.

## Automated Testing/Checking

Our eslint rules (will) have some accessibility checking built in.

## Resources

A collection of resources that will introduce you to the concept of accessibility and some of the standards behind it.

* [WebAIM](http://webaim.org/): WebAIM has provided comprehensive web accessibility solutions since 1999, and is one of the leading providers of web accessibility expertise internationally. WebAIM is a non-profit organization within the [Center for Persons with Disabilities](http://www.cpd.usu.edu/) at [Utah State University](http://www.usu.edu/). The site brings together a huge collection of information about web accessibility. Most of it is up to date and evergreen enough to help you. The [organization's blog](http://webaim.org/blog/) tackles many modern-day, evolving topics related to web accessibility.
* [W3C’s Web Accessibility Initiative](http://www.w3.org/WAI/): The World Wide Web Consortium's Web Accessibility Initiative provides strategies, guidelines and resources to make the Web accessible to people with disabilities.
* [A11y Buzz](http://www.a11ybuzz.com/): Several web folks in the accessibility community launched this site in January 2012. It's a collection of accessibility resources that are triaged and reviewed by experts before they're posted.
* [The Six Simplest Accessibility Tests Anyone Can Do](http://www.karlgroves.com/2013/09/05/the-6-simplest-web-accessibility-tests-anyone-can-do/): A handful of simple things you can do to think about and implement accessibility with little effort as you work on projects.
* [Why Keyboard Accessibility Isn’t the Same Thing as Screen Reader Accessibility](https://www.ssbbartgroup.com/blog/why-keyboard-accessibility-isnt-the-same-thing-as-screen-reader-accessibility/): This blog post explains the three critical aspects of accessibility for interactive web technologies: Keyboard Accessibility, Screen Reader Accessibility and Cognitive Accessibility, and the differences between each.
* [Teaching Accessibility Core Rules](http://www.deque.com/pragmatica11y-teaching-accessibility-core-rules): This post breaks down accessibility principles to their core, making them even easier to think about during projects.

### Going in depth

A set of blogs, written by accessibility consultants and evangelists that go in depth on all things accessibility.

* [The Paciello Group Blog](http://www.paciellogroup.com/blog/): A blog about web accessibility by one of the first accessibility consulting firms.
* [Simply Accessible](http://simplyaccessible.com/): A blog with in-depth web accessibility tutorials.
* [WebAxe](http://www.webaxe.org/): A blog and podcast about web accessibility.
* [456 Berea Street](http://www.456bereastreet.com/): A blog on accessibility and web development by Roger Johansson.
* [Accessible Culture](http://www.accessibleculture.org/): A blog about web accessibility by Jason Kiss, an accessibility and standards researcher located in Wellington, New Zealand.

## Tools

Find tools that will help you bring accessibility into your workflow.

### UX and Design

* [Accessibility for Designers](http://webaim.org/resources/designers/): An infographic about how designers can help create good, accessible websites.
* [The Complete Beginner's Guide to Universal Design](http://www.uxbooth.com/articles/the-complete-beginners-guide-to-universal-design/): A blog post that describes universal design, a set of considerations made to ensure that a product, service, and/or environment is usable by everyone, to the greatest extent possible, without the need for adaptation or specialized design.
* [Colllor](http://colllor.com/) and [0to255](http://0to255.com/): Both are tools that will generate different shades, tints and tones of colors, helpful when creating an accessible color palette.
* [Color Palette Evaluator by NC State](http://accessibility.oit.ncsu.edu/tools/color-contrast/index.php): Evaluate the contrast of different color palettes with the Color Palette Evaluator by NC State.
* [Tanaguru Contrast-Finder](http://contrast-finder.tanaguru.com/form.html): Find high contrast colors when you need them.

### Web Developers

* [Wave](http://wave.webaim.org/): A web tool and Firefox add-on for evaluating the accessibility of web pages.
* [NVDA](http://www.nvda-project.org/): A screenreader for Windows (open source).
* [JAWS](http://www.freedomscientific.com/products/fs/jaws-product-page.asp): The most popular screenreader. Available for Windows and cost money.
* [VoiceOver](http://www.apple.com/accessibility/voiceover/): Built-in screenreader for Mac.
* [VoiceOver for iOS](http://www.apple.com/accessibility/iphone/vision.html): Built-in screenreader for Mac.
* [Chrome Vox](http://www.chromevox.com/): A screenreader for ChromeOS.
* [WCAG 2.0 Cheat Sheet](http://www.w3.org/2009/cheatsheet/#wcag2) A simplified look at WCAG 2.0.
* [WCAG 2.0 Mind Map](http://stamfordinteractive.com.au/wp-content/uploads/2013/03/WCAG20Map.pdf): A clickable mind-map that helps put the web accessibility guidelines into perspective. This WCAG 2.0-on-a-single-page reference is an alternative way to view the guidelines.
* [An Alt Text Decision Tree](http://dev.w3.org/html5/alt-techniques/developer.html#tree): A decision tree for deciding when and how to implement alt text in your work on the web. This is a work in progress by the editors of the HTML5 spec, but its extremely useful in its current form.

## Utilities in Calypso

As we work to make calypso more accessible, we'll probably add more things here.

* [accessible-focus](client/lib/accessible-focus/README.md): A small module which is run at client startup and adds an `accessible-focus` class to the document's html element when keyboard navigation is detected, so that obvious focus styles can be added without being distracting for non-keyboard users.

---

layout: default
title: README

---

# Hey HTML Outputters

Here's how this works:

---

## File structure

1. Make a folder for your project, essay, or interview

2. Create either an `index.html` file (for stuff you've designed yourself) or `index.md` (to use our default styles, great for essays/interviews) file.

3. Put in the appropriate information (title, author etc) at the top in YAML format. You can use the `interview-sample` or `project-sample` as a template to get started.

	The project won't show up yet unless it has a category of 'project,' 'interview,' or 'essay.'

3. Put all assets (images, code, etc) in that folder. TBD: Formatting of more complex or multi-page html

---

## Viewing the site


_If you don't want to install Jekyll or deal with the terminal_

1. Commit and push your changes

2. Go to [risd-gd.github.io/htmloutput/](http://risd-gd.github.io/htmloutput/)

---

_If you have Jekyll installed locally_

1. Navigate to the jekyll-workflow folder in the terminal and run `jekyll serve -w --baseurl ''`.

	
	Note that those are two regular straight quotes despite appearing like smart curly quotes in Anther's typeface. The `-w` means 'watch.' That means every time you make a change to a file, jekyll will run `serve` and generate a site again. Press `Ctrl-C` to cancel watching, or just close the terminal window. The `--baseurl ''` will set the baseurl to nothing, so you can view it locally. 

2. Visit [localhost:4000](http://localhost:4000/)

---

_To install jekyll locally_

1. Run `gem install jekyll`. If you get an error, try `sudo gem install jekyll` and enter your password if prompted.

1. Run `gem install kramdown`. If you get an error, try `sudo gem install kramdown` and enter your password if prompted.


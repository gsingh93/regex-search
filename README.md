Regex Search
===============

This is a chrome extension that allows you to search the text of any page using regular expressions.

You can download the extension here: https://chrome.google.com/webstore/detail/bcdabfmndggphffkchfdcekcokmbnkjl

Necessary build tools
======================
- NodeJS: [http://nodejs.org/](http://nodejs.org/)
- Grunt:
```npm install -g grunt-cli```

Optional build tools
======================
- [tsd](https://npmjs.org/package/tsd) (package manager for TypeScript definition files): ```npm install tsd -g```

Build guide
============
1. Clone this repo and execute ```npm install``` inside the created directory, 
2. Run ```grunt``` in order to build the extension (```build/``` is the output directory).

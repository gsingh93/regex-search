Regex Search
===============

This is a chrome extension written in [TypeScript](http://www.typescriptlang.org/) that allows you to search the text of any page using regular expressions.

You can download the extension here: https://chrome.google.com/webstore/detail/bcdabfmndggphffkchfdcekcokmbnkjl

Pull requests are welcome, just base your changes on the dev branch instead of master, as master is only updated on every release and is often behind the dev branch.

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

Contributers
============

Thanks to [ComFreek](https://github.com/ComFreek) for converting a large portion of the code base to TypeScript.

License
=======

[MIT](https://github.com/gsingh93/regex-search/blob/master/LICENSE.txt)

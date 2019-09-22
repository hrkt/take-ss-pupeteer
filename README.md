# Web Screenshot CLI

A simple Web screenshot CLI using [GoogleChrome/pupeteer](https://github.com/GoogleChrome/puppeteer).

## CLI usage:

execute CLI as below.

```
npx ./src/take-ss [Options] targetUrl
```

with some options.

```
Usage: take-ss [options]

Options:
  -v, --version                     output the version number
  -vw, --viewport-width <int>       Viewport(width) of the screenshot (default: 1200)
  -vh, --viewport-height <int>      Viewport(height) of the screenshot (default: 800)
  -o, --output-filename <filename>  filename of the screenshot (default: "out.png")
  -j, --output-as-json              output result as JSON, base64 encoded image and meta data (default: false)
  -h, --help                        output usage information

```

Example 1. take screenshot and get output as speciried filename.

```
npx ./src/take-ss -o example.com.png http://www.example.com
```

Example 2. take full-page screenshot and get output as speciried filename.

```
npx ./src/take-ss -f -o example.com.png http://www.example.com
```

Example 3. take screenshot in base64 encoded format, inside the JSON file with metadata (title & description)

```
npx ./src/take-ss -j http://www.example.com > out.json
```


## JavaScript

### Requirements

Node v10 or later

### prepare

```
$ npm install
```

### run

```
$ npm run exec

```
### eslint

```
$ npm run eslint
```

### test

```
$ npm run test
```


## LICENSE
MIT

## CI


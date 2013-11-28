# grunt-aglio

> Grunt plugin to generate aglio documentation

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-aglio --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-aglio');
```

## The "aglio" task

### Overview
In your project's Gruntfile, add a section named `aglio` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  aglio: {
    your_target:{
      files:{
        "dest/api.html": ["src/docs/section1.md", "src/docs/section2.md"]
      },
      theme: "default",
      seperator: "\n"
    }
  },
})
```

### Options

#### options.files
Type: `object`

An object with the key as the destination file with an array of src files. The src files will be concatted into a single file before being processed.

#### options.theme
Type: `String`
Default value: `default`

The theme to use, defaults to the `default` theme.

#### options.seperator
Type: `String`
Default value: `grunt.util.linefeed`

When multiple source files are provided, the seperator is used to combine them together. 

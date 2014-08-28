[![Dependency Status](https://david-dm.org/arbus/grunt-aglio.png)](https://david-dm.org/arbus/grunt-aglio)
[![Build Status](https://travis-ci.org/arbus/grunt-aglio.png?branch=master)](https://travis-ci.org/arbus/grunt-aglio)

grunt-aglio
===========

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

## The Aglio task

### Overview

_Run this task with the `grunt aglio` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
Multiple src files will be concatted into a single file before being processed.

In your project's Gruntfile, add a section named `aglio` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  aglio: {
    your_target:{
      files:{
        "dest/api.html": ["src/docs/section1.md", "src/docs/section2.md"]
      },
      options: {
        theme: "default",
        separator: "\n"
      }
    }
  },
})
```

### Options

#### options.theme
Type: `String`
Default value: `default`

The theme to use, defaults to the `default` theme. See [aglio](https://github.com/danielgtaylor/aglio) project for a list of possible template. Actual possible values are `default`, `flatly`, `slate` and `cyborg` with a *multi* version for each. i.e. 'default-multi'.
You can also pass in the path to your custom Jade templates here. The path is relative to your project root

#### options.separator
Type: `String`
Default value: `empty string`

When multiple source files are provided, the separator is used to combine them together.

#### options.filter
Type: `Function`
Default value: `function(src) { return src; }`

The src is passed through this function before passed into aglio. You can use this step to automatically add any tags, CI badges or build revision content into the src. Windows users can take advantage of this function to remove '\r' characters so that snowcrash will parse their files properly

### Usage examples

#### Basic
This configuration allows you to split your API definition across multiple files and have it concatted in.
```
grunt.initConfig({
  aglio: {
    your_target:{
      files:{
        "dest/api.html": ["src/docs/section1.md", "src/docs/section2.md"]
      },
      options: {
        theme: "slate"
      }
    }
  },
})
```

#### Basic w/ Filter
This allows you to tag your documentation to a particular revision number that you may be using elsewhere
```
grunt.initConfig({
  aglio: {
    your_target:{
      files:{
        "dest/api.html": ["src/docs/section1.md", "src/docs/section2.md"]
      },
      options: {
        theme: "slate",
        filter: function(src){
          return "> This documentation is correct as of " + revNum + "\n" + src;
        }
      }
    }
  },
})
```

#### Custom Jade Template
This configuration allows you to specify your own jade template. A guide on how to write your own can be found at the [aglio](https://github.com/danielgtaylor/aglio#custom-themes) repo.
```
grunt.initConfig({
  aglio: {
    your_target:{
      files:{
        "dest/api.html": ["src/docs/section1.md", "src/docs/section2.md"]
      },
      options: {
        theme: "my/templates/colorful"
      }
    }
  },
})
```

## Changelog
+ 0.3.0
  + Change options format to follow grunt standards thanks to @JSteunou
  + Update aglio version to 1.15
+ 0.2.1
  + Bug fix for getting templates thanks to @cjthompson
+ 0.2.0
  + Minor breaking change, paths for custom templates are now relative to the project root, thanks to @chesleybrown.
  + Bump aglio version to 1.14
+ 0.1.7
  + Bump aglio version to 1.13
+ 0.1.6
  + Bump aglio version to 1.12
+ 0.1.5
  + Made the task async, thanks to @ebonlieu

## Contributers

+ @JSteunou
+ @cjthompson
+ @chesleybrown
+ @ebonlieu

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
        theme: "custom",
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

The [custom theme](https://github.com/danielgtaylor/aglio#using-custom-themes) (a.k.a. theme engine) to use. The default/built-in theme ([olio](https://github.com/danielgtaylor/aglio/tree/olio-theme)) is used if the custom theme's node package is not installed.


#### options.theme*

Type: (varies) Default value (varies)

**IMPORTANT NOTE**: As of aglio 2.x, [all theme options are theme-specific](https://github.com/danielgtaylor/aglio#writing-a-theme-engine) (see [changelog](https://github.com/danielgtaylor/aglio/blob/master/Changelog.md#200---2015-07-16) for details). As a result, this Grunt task does not validate such theme options -- they are passed directly to aglio, so it's possible this task will fail if a theme option is passed with an invalid value. See the [default theme's list of options](https://github.com/danielgtaylor/aglio/tree/olio-theme#theme-options) for examples names and values.


#### options.separator
Type: `String`
Default value: `empty string`

When multiple source files are provided, the separator is used to combine them together.

#### options.filter
Type: `Function`
Default value: `function(src) { return src; }`

The src is passed through this function before passed into aglio. You can use this step to automatically add any tags, CI badges or build revision content into the src. Windows users can take advantage of this function to remove '\r' characters so that snowcrash will parse their files properly

#### options.includePath
Type: `String`
Default value: `process.cwd()`

Base directory for relative includes.

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
        themeVariables: "slate"
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
        themeVariables: "slate",
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
+ 0.4.1
  + Bump aglio version to 2.2
+ 0.4.0
  + Bump aglio version to 2.1 thanks to @blech
+ 0.3.4
  + Bump aglio version to 1.18
+ 0.3.3
  + `includePath` option thanks to @LoicMahieu
+ 0.3.2
  + Output line no of errors thanks to @Fridus
+ 0.3.1
  + Fix bug with multiple targets thanks to @cjthompson
  + Update aglio version to 1.16
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

+ @LoicMahieu
+ @Fridus
+ @JSteunou
+ @cjthompson
+ @chesleybrown
+ @ebonlieu

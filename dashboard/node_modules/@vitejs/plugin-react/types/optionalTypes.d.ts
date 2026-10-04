/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore --- `@rolldown/plugin-babel` is an optional peer dependency, so this may cause an error
import type * as pluginBabel from '@rolldown/plugin-babel'
// @ts-ignore --- `babel-plugin-react-compiler` is an optional peer dependency, so this may cause an error
import type * as babelPluginReactCompiler from 'babel-plugin-react-compiler'
// @ts-ignore --- `oxc-transform-react` is an optional peer dependency, so this may cause an error
import type * as oxcTransformReact from 'oxc-transform-react'

// @ts-ignore --- `@rolldown/plugin-babel` is an optional peer dependency, so this may cause an error
export type RolldownBabelPreset = pluginBabel.RolldownBabelPreset
// @ts-ignore --- `babel-plugin-react-compiler` is an optional peer dependency, so this may cause an error
export type ReactCompilerBabelPluginOptions =
  babelPluginReactCompiler.PluginOptions
// @ts-ignore --- `oxc-transform-react` is an optional peer dependency, so this may cause an error
export type ReactCompilerOptions = oxcTransformReact.ReactCompilerOptions

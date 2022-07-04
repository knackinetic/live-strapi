/**
 * Strapi custom scalar types
 */

import { MinMaxLengthOption, MinMaxOption } from './base';
import { StringAttribute } from './string';

export type JSON<T extends object = object> = T;

export type Media = any;

/**
 * Setters for the attributes options
 */

// required
export type RequiredAttribute = { required: true };
export type NonRequiredAttribute = { required: false };

// private
export type PrivateAttribute = { private: true };
export type NonPrivateAttribute = { private: false };

// unique
export type UniqueAttribute = { unique: true };
export type NonUniqueAttribute = { unique: false };

// configurable
export type ConfigurableAttribute = { configurable: true };
export type NonConfigurableAttribute = { configurable: false };

// min/max
export type SetMinMax<T extends MinMaxOption<U>, U = number> = T;

// minLength/maxLength
export type SetMinMaxLength<T extends MinMaxLengthOption> = T;

// pluginOptions
export type SetAttributePluginOptions<T extends object = object> = { pluginOptions?: T };

// default
export type DefaultTo<T> = { default: T };

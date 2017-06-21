/*
 * Copyright 2016 resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const electron = require('electron');
const utils = require('../../shared/utils');
const progressStatus = require('../modules/progress-status');

/**
 * @summary The title of the main window upon program launch
 * @type {String}
 * @private
 * @constant
 */
const initialTitle = document.title;

/**
 * @summary Make the full window status title
 * @private
 *
 * @param {String} baseTitle - base window title
 * @param {Object} currentFlashState - flash state object
 *
 * @returns {String}
 *
 * @example
 * const title = makeTitle({
 *   type: 'write',
 *   percentage: 55,
 *   speed: 2049
 * });
 *
 * console.log(title);
 * // 'Etcher \u2013 55% Flashing'
 */
const makeTitle = (baseTitle, currentFlashState) => {
  const subtitle = progressStatus.fromFlashState(currentFlashState);
  const DASH_UNICODE_CHAR = '\u2013';
  return `${baseTitle} ${DASH_UNICODE_CHAR} ${subtitle}`;
};

/**
 * @summary A reference to the current renderer Electron window
 * @type {Object}
 * @protected
 *
 * @description
 * We expose this property to `this` for testability purposes.
 */
exports.currentWindow = electron.remote.getCurrentWindow();

/**
 * @summary Set operating system window progress
 * @function
 * @public
 *
 * @description
 * Show progress inline in operating system task bar
 *
 * @param {Number} state - flashing metadata
 *
 * @example
 * windowProgress.set({
 *   type: 'write',
 *   percentage: 55,
 *   speed: 2049
 * });
 */
exports.set = (state) => {
  const title = makeTitle(initialTitle, state);

  exports.currentWindow.setProgressBar(utils.percentageToFloat(state.percentage));
  exports.currentWindow.setTitle(title);
};

/**
 * @summary Clear the window progress bar
 * @function
 * @public
 *
 * @example
 * windowProgress.clear();
 */
exports.clear = () => {

  // Passing 0 or null/undefined doesn't work.
  const ELECTRON_PROGRESS_BAR_RESET_VALUE = -1;

  exports.currentWindow.setProgressBar(ELECTRON_PROGRESS_BAR_RESET_VALUE);
  exports.currentWindow.setTitle(initialTitle);
};

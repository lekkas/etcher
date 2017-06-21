/*
 * Copyright 2017 resin.io
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

const settings = require('../models/settings');
const utils = require('../../shared/utils');

/**
 * @summary Make the progress status subtitle string
 *
 * @param {Object} currentFlashState - flashing metadata
 *
 * @returns {String}
 *
 * @example
 * const status = progressStatus.fromFlashState({
 *   type: 'write',
 *   percentage: 55,
 *   speed: 2049
 * });
 *
 * console.log(fullStatus);
 * // '55% Flashing'
 */
exports.fromFlashState = (currentFlashState) => {
  const isChecking = currentFlashState.type === 'check';

  let subtitle = '';

  if (currentFlashState.percentage === utils.PERCENTAGE_MINIMUM && !currentFlashState.speed) {
    subtitle = 'Starting...';

  } else if (currentFlashState.percentage === utils.PERCENTAGE_MAXIMUM) {
    if (isChecking && settings.get('unmountOnSuccess')) {
      subtitle = 'Unmounting...';

    } else {
      subtitle = 'Finishing...';
    }

  } else if (currentFlashState.type === 'write') {
    subtitle = `${currentFlashState.percentage}% Flashing`;

  } else if (currentFlashState.type === 'check') {
    subtitle = `${currentFlashState.percentage}% Validating`;
  }

  if (subtitle === '') {
    throw new Error(`Invalid state: ${JSON.stringify(currentFlashState)}`);
  }

  return subtitle;
};

/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _ = require("canal-js-utils/misc");

function Template(index) {
  this.index = index;
}

Template.getLiveEdge = function(videoIndex, manifest) {
  return (Date.now() / 1000 - manifest.availabilityStartTime) - manifest.suggestedPresentationDelay;
};

Template.prototype.checkRange = function() {
  return true;
};

Template.prototype.createSegment = function(ts) {
  var { startNumber, duration } = this.index;

  if (startNumber == null) startNumber = 1;

  var number = Math.floor(ts / duration) + startNumber;
  var time = number * duration;

  return {
    id: number,
    media: this.index.media,
    time,
    number,
    range: undefined,
    duration: this.index.duration,
  };
};

Template.prototype.getSegments = function(up, to) {
  var { duration } = this.index;

  var segments = [];
  for (var time = up; time <= to; time += duration) {
    segments.push(this.createSegment(time));
  }

  return segments;
};

Template.prototype.addSegment = function() {
  return false;
};

module.exports = Template;

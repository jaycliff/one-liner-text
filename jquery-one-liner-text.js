/*
    Copyright 2016 Jaycliff Arcilla of Eversun Software Philippines Corporation

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
/*
    DEPENDENCIES:
        jQuery library
*/
/*global jQuery*/
(function ($) {
	"use strict";
	$.fn.oneLinerText = (function () {
		var hasOwnProperty = Object.prototype.hasOwnProperty, pool_of_plain_objects = (function () {
			var pool = [];
			return {
				summon: function () {
					if (pool.length > 0) {
						return pool.pop();
					}
					return {};
				},
				banish: function (obj) {
					var key;
					for (key in obj) {
						if (hasOwnProperty.call(obj, key)) {
							delete obj[key];
						}
					}
					pool.push(obj);
					return this;
				}
			};
		}());
		function mouseHandler(event) {
			/*jshint validthis:true*/
			var $self = $.data(this, '$self'), animate_options = $.data(this, 'oneLinerText:animate_options'), scrollLeftMax;
			switch (event.type) {
			case 'mouseenter':
				// http://stackoverflow.com/questions/5138373/how-do-i-get-the-max-value-of-scrollleft
				scrollLeftMax = this.scrollWidth - this.clientWidth;
				animate_options.scrollLeft = scrollLeftMax;
				$self.stop(true).animate(animate_options, scrollLeftMax * 10, 'linear');
				break;
			case 'mouseleave':
				animate_options.scrollLeft = 0;
				$self.stop(true).animate(animate_options, Math.min(this.scrollLeft * 1, 100), 'linear');
				break;
			}
		}
		function eachHandler() {
			/*jshint validthis:true*/
			var destroy = !!eachHandler._destroy,
				style,
				prev_style,
				key,
				self = this,
				$self = $.data(self, '$self'),
				inner_width;
			if (!($self instanceof $)) {
				$self = $(self);
				$.data(self, '$self', $self);
			}
			if (!$self.data('oneLinerText:yes')) {
				if (!destroy) {
					style = self.style;
					prev_style = pool_of_plain_objects.summon();
					inner_width = $self.innerWidth();
					if (style.overflowX !== 'hidden') {
						prev_style.overflowX = style.overflowX;
						style.overflowX = 'hidden';
					}
					if (style.whiteSpace !== 'nowrap') {
						prev_style.whiteSpace = style.whiteSpace;
						style.whiteSpace = 'nowrap';
					}
					if (inner_width < self.scrollWidth) {
						//console.log(self.id + ': innerWidth -> ' + inner_width + ', scrollWidth -> ' + self.scrollWidth);
						$self.data('oneLinerText:yes', true).data('oneLinerText:prev_style', prev_style).data('oneLinerText:animate_options', pool_of_plain_objects.summon()).on('mouseenter mouseleave', mouseHandler);
					} else {
						for (key in prev_style) {
							if (hasOwnProperty.call(prev_style, key)) {
								style[key] = prev_style[key];
								delete prev_style[key];
							}
						}
						pool_of_plain_objects.banish(prev_style);
					}
				}
			} else {
				if (destroy) {
					style = self.style;
					prev_style = $self.data('oneLinerText:prev_style');
					for (key in prev_style) {
						if (hasOwnProperty.call(prev_style, key)) {
							style[key] = prev_style[key];
							delete prev_style[key];
						}
					}
					pool_of_plain_objects.banish(prev_style).banish($self.data('oneLinerText:animate_options'));
					$self.data('oneLinerText:prev_style', null).data('oneLinerText:animate_options', null).data('oneLinerText:yes', false);
				}
			}
		}
		return function oneLinerText(param) {
			if (typeof param === "string") {
				if (param === 'destroy') {
					eachHandler._destroy = true;
				}
			}
			this.each(eachHandler);
			eachHandler._destroy = false;
			return this;
		};
	}());
}(typeof jQuery === "function" && jQuery));

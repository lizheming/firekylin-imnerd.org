const ArchiveWidget = require('./archive');
const DoubanWidget = require('./douban');
const SlidesWidget = require('./slides');
const WalineWidget = require('./waline');

module.exports = (widgets) => ({
  Widget_Custom_Archive: ArchiveWidget(widgets),
  Widget_Custom_Douban: DoubanWidget(widgets),
  Widget_Custom_Slides: SlidesWidget(widgets),
  Widget_Custom_Waline: WalineWidget(widgets),
});

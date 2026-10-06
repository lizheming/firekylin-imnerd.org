const DoubanWidget = require('./douban');
const WalineWidget = require('./waline');

module.exports = (widgets) => ({
  Widget_Custom_Douban: DoubanWidget(widgets),
  Widget_Custom_Waline: WalineWidget(widgets),
});

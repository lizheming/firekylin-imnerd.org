const DoubanWidget = require('./douban');

module.exports = (widgets) => ({
  Widget_Custom_Douban: DoubanWidget(widgets),
});
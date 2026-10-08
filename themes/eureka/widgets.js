'use strict';

module.exports = function () {
  const CoreArchive = require('firekylin/src/widget/archive');

  class EurekaArchive extends CoreArchive {
    async executePost() {
      await super.executePost();
      if (!this.have() || !this.row.id) return;

      const source = await this.model('post')
        .where({id: this.row.id})
        .field('markdown_content')
        .setRelation(false)
        .find();

      this.row.markdown_content = source && source.markdown_content ? source.markdown_content : '';
    }
  }

  return {Widget_Archive_Eureka: EurekaArchive};
};

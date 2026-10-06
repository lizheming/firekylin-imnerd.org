const ArchiveWidget = require('firekylin/src/widget/archive');

module.exports = () => {
  return class extends ArchiveWidget {
    async executeArchive() {
      const model = this.model('post');
      const posts = await model
        .field('id,title,pathname,create_time,options,content,summary,comment_num')
        .order('create_time DESC')
        .setRelation(false)
        .where(model.getWhereCondition())
        .select();

      posts.forEach(post => {
        const yearMonth = think.datetime(post.create_time, 'YYYY年MM月');
        if (!this.grouped[yearMonth]) this.grouped[yearMonth] = [];
        this.grouped[yearMonth].push(this.push(post));
      });
    }
  };
};

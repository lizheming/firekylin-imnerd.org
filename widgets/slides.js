const fs = require('fs');
const path = require('path');

module.exports = (widgets) => {
  return class extends widgets.Widget {
    param(name) {
      const value = this.parameter[name];
      return value !== undefined && value !== '' ? value : this.controller.get(name);
    }

    async execute() {
      const file = path.join(__dirname, '../data/slides.json');
      let slides = [];

      try {
        const data = JSON.parse(await fs.promises.readFile(file, 'utf8'));
        if (!Array.isArray(data)) throw new TypeError('slides.json must contain an array');
        slides = data.filter(slide => slide && typeof slide === 'object');
      } catch (error) {
        this.error = error.message;
        console.error('Read slides.json failed:', error.message);
      }

      slides.sort((a, b) => String(b.time || '').localeCompare(String(a.time || '')));

      const pageSize = Math.max(1, Number.parseInt(this.parameter.pageSize, 10) || 12);
      const requestedPage = Math.max(1, Number.parseInt(this.param('page'), 10) || 1);
      const count = slides.length;
      const totalPages = Math.max(1, Math.ceil(count / pageSize));
      const currentPage = Math.min(requestedPage, totalPages);
      this.pagination = {count, totalPages, pageSize, currentPage};

      const offset = (currentPage - 1) * pageSize;
      this.pushAll(slides.slice(offset, offset + pageSize));
    }
  };
};

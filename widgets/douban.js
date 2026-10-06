const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter(r => r.length > 1 || r[0]);
  return body.map(r => Object.fromEntries(header.map((key, i) => [key, r[i] || ''])));
}

function pubdateYear(pubdate) {
  const matched = /^(\d{4})/.exec(pubdate || '');
  return matched ? Number(matched[1]) : null;
}

module.exports = (widgets) => {
  return class extends widgets.Widget {
    param(name) {
      const value = this.parameter[name];
      return value !== undefined && value !== '' ? value : this.controller.get(name);
    }

    getGenres(list = this.allItems || []) {
      const genres = new Set();
      for (const row of list) {
        String(row.genres || '').split(',').forEach(item => {
          const genre = item.trim();
          if (genre) genres.add(genre);
        });
      }
      return Array.from(genres).sort((a, b) => a.localeCompare(b, 'zh-CN'));
    }

    getUrl(params = {}) {
      const query = Object.assign({}, this.controller.ctx.query, params);
      const search = Object.keys(query)
        .filter(key => query[key] !== '' && query[key] !== null && typeof query[key] !== 'undefined')
        .flatMap(key => {
          const values = Array.isArray(query[key]) ? query[key] : [query[key]];
          return values.map(value => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        })
        .join('&');
      return `${this.controller.ctx.path}${search ? `?${search}` : ''}`;
    }

    async execute() {
      const file = path.join(__dirname, '../data/douban/movie.csv');
      let list = [];
      try {
        list = parseCSV(await fs.promises.readFile(file, 'utf8'));
      } catch (e) {
        console.error('Read douban movie.csv failed:', e.message);
      }

      const order = String(this.param('order') || '').trim();
      list.sort((a, b) => {
        if (order === 'rating') {
          return Number(b.rating) - Number(a.rating);
        }
        return (b.star_time || '').localeCompare(a.star_time || '');
      });
      this.allItems = list;
      this.genres = this.getGenres();

      const star = Number(this.param('star'));
      if (star > 0) {
        list = list.filter(row => Number(row.star) == star);
      }
      const year = Number(this.param('year'));
      if (year > 0) {
        list = list.filter(row => pubdateYear(row.pubdate) === year);
      }
      const genre = String(this.param('genre') || '').trim();
      if (genre) {
        list = list.filter(row => String(row.genres || '').split(',').map(item => item.trim()).includes(genre));
      }

      const pageSize = Number(this.parameter.pageSize) || 100;
      const page = Number(this.param('page')) || 1;
      const count = list.length;
      const totalPages = Math.max(1, Math.ceil(count / pageSize));
      const currentPage = Math.min(Math.max(page, 1), totalPages);
      this.pagination = {count, totalPages, pageSize, currentPage};

      this.pushAll(list.slice((currentPage - 1) * pageSize, currentPage * pageSize));
    }
  };
};

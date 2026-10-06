function positiveInteger(value, fallback, maximum = 100) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number) || number < 1) return fallback;
  return Math.min(number, maximum);
}

function parseWalineConfig(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return {serverURL: value};
  }
}

module.exports = (widgets) => {
  return class extends widgets.Widget {
    async getServerURL() {
      if (this.parameter.serverURL) return this.parameter.serverURL;
      if (process.env.WALINE_SERVER_URL) return process.env.WALINE_SERVER_URL;

      const options = await this.model('options').getOptions();
      if (!options.comment || options.comment.type !== 'waline') return '';
      return parseWalineConfig(options.comment.name).serverURL || '';
    }

    async execute() {
      this.error = null;
      this.pagination = null;

      try {
        const serverURL = String(await this.getServerURL()).trim();
        if (!serverURL) {
          this.error = 'Waline serverURL is not configured';
          return;
        }
        this.serverURL = serverURL.replace(/\/$/, '');

        const url = new URL('/api/comment', `${this.serverURL}/`);
        const path = String(this.parameter.path || '').trim();
        const pageSize = positiveInteger(
          this.parameter.pageSize || this.parameter.count,
          path ? 20 : 10
        );

        if (path) {
          url.searchParams.set('path', path);
          url.searchParams.set('page', positiveInteger(this.parameter.page, 1));
          url.searchParams.set('pageSize', pageSize);
          // url.searchParams.set('sortBy', this.parameter.sortBy || 'latest');
        } else {
          url.searchParams.set('type', 'recent');
          url.searchParams.set('count', pageSize);
        }

        const response = await fetch(url, {
          headers: {accept: 'application/json'},
          signal: AbortSignal.timeout(positiveInteger(this.parameter.timeout, 5000, 30000))
        });
        if (!response.ok) {
          throw new Error(`Waline request failed with HTTP ${response.status}`);
        }

        const result = (await response.json())?.data;
        if (result && result.errno) {
          throw new Error(result.errmsg || `Waline API error ${result.errno}`);
        }

        const list = Array.isArray(result) ? result : (result.data || []);
        if (!Array.isArray(list)) throw new TypeError('Invalid Waline comment response');

        if (path) {
          this.pagination = {
            count: Number(result.count) || list.length,
            totalPages: Number(result.totalPages) || 1,
            pageSize: Number(result.pageSize) || pageSize,
            currentPage: Number(result.page) || positiveInteger(this.parameter.page, 1)
          };
        }
        this.pushAll(list);
      } catch (error) {
        this.error = error.message;
        console.error('Fetch Waline comments failed:', error.message);
      }
    }
  };
};

const mermaidPlugin = require('./markdown-it-mermaid');

module.exports = {
  register(ctx) {
    ctx.events.on('markdown.configure', async md => {
      md.use(mermaidPlugin, {
        config: {
          theme: 'neutral',
          securityLevel: 'strict'
        }
      });

      return md;
    });
  }
};
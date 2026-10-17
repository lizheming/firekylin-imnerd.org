
'use strict';

const {randomUUID} = require('node:crypto');

let mermaidPromise;
let renderQueue = Promise.resolve();

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('isomorphic-mermaid')
      .then(mod => mod.default)
      .catch(error => {
        mermaidPromise = null;
        throw error;
      });
  }
  return mermaidPromise;
}

// Mermaid 内部使用共享 DOM / 全局配置。
// 将渲染任务串行化，避免多请求相互干扰。
function enqueue(task) {
  const next = renderQueue.then(task);
  renderQueue = next.catch(() => {});
  return next;
}

function isMermaid(token) {
  return token.type === 'fence' &&
    token.info.trim().split(/\s+/)[0].toLowerCase() === 'mermaid';
}

function fallback(md, content) {
  return `<pre><code class="language-mermaid">${
    md.utils.escapeHtml(content)
  }</code></pre>\n`;
}

function markdownItMermaid(md, options = {}) {
  const {
    theme = 'default',
    maxDiagrams = 20,
    maxSourceLength = 50000,
    onError = () => {},
    // 可选：部署方提供的 SVG 净化函数
    sanitizeSvg,
    // 可选：注入渲染器，方便单元测试
    renderSvg
  } = options;

  if (typeof md.renderAsync === 'function') {
    throw new Error('markdown-it renderAsync already registered');
  }

  async function renderDiagram(source) {
    return enqueue(async () => {
      if (renderSvg) {
        return renderSvg(source);
      }

      const mermaid = await loadMermaid();

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        htmlLabels: false,
        theme
      });

      const id = `mermaid-${randomUUID()}`;
      const result = await mermaid.render(id, source);

      return result.svg;
    });
  }

  md.renderAsync = async function(source, env = {}) {
    // 保留 markdown-it 原有的 parse + render 流程
    const tokens = md.parse(String(source || ''), env);
    const diagrams = tokens.filter(isMermaid);

    if (diagrams.length > maxDiagrams) {
      throw new Error(
        `Too many Mermaid diagrams: ${diagrams.length}`
      );
    }

    for (const token of diagrams) {
      const content = token.content;

      try {
        if (content.length > maxSourceLength) {
          throw new Error('Mermaid source exceeds size limit');
        }

        let svg = await renderDiagram(content);

        if (sanitizeSvg) {
          svg = await sanitizeSvg(svg);
        }

        if (typeof svg !== 'string' ||
            !svg.trimStart().startsWith('<svg')) {
          throw new Error('Invalid Mermaid SVG result');
        }

        token.type = 'html_block';
        token.tag = '';
        token.content =
          `<div class="markdown-mermaid">${svg}</div>\n`;
      } catch (error) {
        onError(error, content);

        token.type = 'html_block';
        token.tag = '';
        token.content = fallback(md, content);
      }
    }

    return md.renderer.render(tokens, md.options, env);
  };
}

module.exports = markdownItMermaid;
/** html 转 markdown */
export const html2md = (htmlText: string) => {
  let markdownText = htmlText;
  let codeContent = []; // code 标签
  let preContent = []; // pre 标签
  let tableContent = []; // table 标签
  let olContent = []; // ol 标签
  let imgContent = []; // img 标签
  let aContent = []; // a 标签
  let resourceContent = []; // 资源

  // 清除 <style> 和 <script> 及内容
  markdownText = markdownText
    .replace(/<style\s*[^>]*?>[^]*?<\/style>/gi, '')
    .replace(/<script\s*[^>]*?>[^]*?<\/script>/gi, '');

  // 储存 <pre> 内容
  preContent = markdownText.match(/<pre\s*[^>]*?>[^]*?<\/pre>/gi) || [];
  // 存在 <pre>
  if (preContent.length) {
    for (let i = 0; i < preContent.length; i++) {
      const text = preContent[i];
      // 匹配原文本中 <pre> 的内容
      const match = text.match(/<pre\s*[^>]*?>([\s\S]*)?<\/pre>/i);
      // 标记原文本中 <pre> 的内容
      markdownText = markdownText.replace(match![1], '`#preContent#`');
      // 匹配代码块的语言
      const languageMatch = text.match(/language-(.*)?[\s'"]/i) || [];
      // 获取代码块的语言
      const language = languageMatch[1]
        ? `${languageMatch[1]}[~wrap]`
        : '[~wrap]';
      // 去掉多余标签获得内容
      const content = clearHtmlTag(text);
      // 将内容替换标记
      markdownText = markdownText.replace(/`#preContent#`/, language + content);
    }
    // 清除 <pre>、</pre> 标签
    markdownText = markdownText
      .replace(/<pre\s*[^>]*?>/gi, '```')
      .replace(/<\/pre>/gi, '[~wrap]```[~wrap]');
  }

  // 储存 <code> 内容
  codeContent = markdownText.match(/<code\s*[^>]*?>[\s\S]*?<\/code>/gi) || [];
  // 存在 <code>
  if (codeContent.length) {
    for (let i = 0; i < codeContent.length; i++) {
      const text = codeContent[i];
      // 匹配原文本中 <code> 的内容
      const match = text.match(/<code\s*[^>]*?>([\s\S]*)?<\/code>/i);
      // 标记原文本中 <code> 的内容
      markdownText = markdownText.replace(match![1], '`#codeContent#`');
      // 去掉多余标签获得内容
      const content = clearHtmlTag(text);
      // 将内容替换标记
      markdownText = markdownText.replace(/`#codeContent#`/, content);
    }
    // 清除 <code>、</code> 标签
    markdownText = markdownText
      .replace(/<code\s*[^>]*?>/gi, '`')
      .replace(/<\/code>/gi, '`');
  }

  // 储存 <a> 内容
  aContent = markdownText.match(/<a\s*[^>]*?>[^]*?<\/a>/gi) || [];
  // 存在 <a>
  if (aContent.length) {
    for (let i = 0; i < aContent.length; i++) {
      const text = aContent[i];
      // 标记原文本中 <a> 的内容
      markdownText = markdownText.replace(text, '`#aContent#`');
      // 获取链接地址
      const hrefMatch = text.match(/href=(?:'|"|&#34;)([\S]*)?(?:'|"|&#34;)/i);
      // 去掉多余标签获得链接描述
      const title = clearHtmlTag(text);
      // 拼接链接文本
      const result = `[${title}](${hrefMatch![1]})`;
      // 将链接文本替换标记
      markdownText = markdownText.replace(/`#aContent#`/, result);
    }
  }

  // 储存 <img> 内容
  imgContent = markdownText.match(/<img\s*[^>]*?>[^]*?(<\/img>)?/gi) || [];
  // 存在 <img>
  if (imgContent) {
    for (let i = 0; i < imgContent.length; i++) {
      const text = imgContent[i];
      // 标记原文本中 <img> 的内容
      markdownText = markdownText.replace(text, '`#imgContent#`');
      // 获取图片地址
      const srcMatch = text.match(/src=(?:'|"|&#34;)([\S]*)?(?:'|"|&#34;)/i);
      // 获取图片描述
      const altMatch = text.match(/alt=(?:'|"|&#34;)([\S]*)?(?:'|"|&#34;)/i);
      const src = srcMatch ? srcMatch[1] : '';
      const alt = altMatch ? altMatch[1] : '';
      // 拼接图片文本
      const result = `![${alt}](${src})`;
      // 将图片文本替换标记
      markdownText = markdownText.replace(/`#imgContent#`/, result);
    }
  }

  // 储存资源内容（<span data-w-e-type="resource"）
  resourceContent =
    markdownText.match(
      /<span\s*data-w-e-type="resource"[^>]*?>[^]*?<\/span>/gi,
    ) || [];
  // 标记原文本中资源内容
  markdownText = markdownText.replace(
    /<span\s*data-w-e-type="resource"[^>]*?>[^]*?<\/span>/gi,
    '`#resourceContent#`',
  );

  // 获取纯净（无属性）的 html
  const propertyMatch = markdownText.matchAll(/<[a-zA-Z0-9]*(\s[^>]*)+>/g);
  markdownText = matchAllStep(propertyMatch, markdownText);

  // <h1><h2>...等标题标签转为 #
  markdownText = markdownText
    .replace(/<h1>/gi, '# ')
    .replace(/<\/h1>/gi, '[~wrap]')
    .replace(/<h2>/gi, '## ')
    .replace(/<\/h2>/gi, '[~wrap]')
    .replace(/<h3>/gi, '### ')
    .replace(/<\/h3>/gi, '[~wrap]')
    .replace(/<h4>/gi, '#### ')
    .replace(/<\/h4>/gi, '[~wrap]')
    .replace(/<h5>/gi, '##### ')
    .replace(/<\/h5>/gi, '[~wrap]')
    .replace(/<h6>/gi, '###### ')
    .replace(/<\/h6>/gi, '[~wrap]');

  // 处理一些常用的结构标签
  markdownText = markdownText
    .replace(/<p><br><\/p>/gi, '[~wrap]')
    .replace(/<br>|<br\/>/gi, '[~wrap]')
    .replace(/<\/p>|<\/div>/gi, '[~wrap]')
    .replace(/<meta>|<span>|<p>|<div>|<\/span>/gi, '');

  // 分割线：将 <hr> 转为 ---
  markdownText = markdownText.replace(/<hr>|<hr\/>/gi, '---[~wrap]');

  // 粗体：将 <b>、<strong> 转为 **
  markdownText = markdownText.replace(/<b>|<strong>|<\/b>|<\/strong>/gi, '**');

  // 斜体：将 <i>、<em>、<abbr>、<dfn>、<cite>、<address> 转为 *
  markdownText = markdownText.replace(
    /<i>|<em>|<abbr>|<dfn>|<cite>|<address>|<\/i>|<\/em>|<\/abbr>|<\/dfn>|<\/cite>|<\/address>/gi,
    '*',
  );

  // 删除线：将 <s>、<del> 转为 ~~
  markdownText = markdownText.replace(/<del>|<s>|<\/del>|<\/s>/gi, '~~');

  // 引用：将 <blockquote> 转为 >
  markdownText = markdownText
    .replace(/<blockquote>/gi, '> ')
    .replace(/<\/blockquote>/gi, '[~wrap][~wrap]');

  // 储存 <table> 内容
  tableContent = markdownText.match(/<table\s*[^>]*?>[^]*?<\/table>/gi) || [];
  // 存在 <table>
  if (tableContent.length) {
    const tableDataList: any[] = [];
    for (let i = 0; i < tableContent.length; i++) {
      const text = tableContent[i];
      // 标记原文本中 <table> 的内容
      markdownText = markdownText.replace(text, '`#tableContent#`');
      // 创建表格内容容器
      tableDataList[i] = [];
      const thList: string[] = [];
      const tdList: string[] = [];
      const thMatch = text.matchAll(/<th>[\s\S]*?<\/th>/gi);
      const tdMatch = text.matchAll(/<td>[\s\S]*?<\/td>/gi);
      if (thMatch) {
        // 表格表头
        getMatchAllContent(thMatch, thList, /<th>([\s\S]*)?<\/th>/);
        tableDataList[i].push(thList);
      }
      if (tdMatch) {
        // 表格内容
        getMatchAllContent(tdMatch, tdList, /<td>([\s\S]*)?<\/td>/);
        tableDataList[i].push(tdList);
      }
      // 构建表格
      const result = buildTable(tableDataList[i]) || '';
      markdownText = markdownText.replace(/`#tableContent#`/i, result);
    }
  }

  // 储存 <ol> 内容
  olContent = markdownText.match(/<ol\s*[^>]*?>[\s\S]*?<\/ol>/gi) || [];
  // 存在 <ol>
  if (olContent.length) {
    for (let i = 0; i < olContent.length; i++) {
      let text = olContent[i];
      // 匹配原文本中 <ol> 的内容
      const match = text.match(/<ol\s*[^>]*?>([\s\S]*)?<\/ol>/i);
      // 标记原文本中 <ol> 的内容
      markdownText = markdownText.replace(match![1], '`#olContent#`');
      // 获取列表列数
      const num = (text.match(/<li>/gi) || []).length;
      for (let i = 1; i <= num; i++) {
        // 清除 <li> 标签
        text = text.replace(/<li>/i, `${i}. `).replace(/<\/li>/, '[~wrap]');
      }
      markdownText = markdownText.replace(/`#olContent#`/i, clearHtmlTag(text));
    }
  }

  // 无序列表：将 <li>、<dd> 转为 -
  markdownText = markdownText
    .replace(/<li>|<dd>/gi, '- ')
    .replace(/<\/li>|<\/dd>/gi, '[~wrap]');

  // 换行处理：将换行标记 [~wrap] 转为 \n
  markdownText = markdownText.replace(/\[~wrap\]/gi, '\n');

  // 清除剩余 html 标签
  markdownText = clearHtmlTag(markdownText);

  // 还原原文本中的 < 和 > 符号
  markdownText = markdownText.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');

  // 存在资源
  if (resourceContent.length) {
    for (let i = 0; i < resourceContent.length; i++) {
      let replaceUrl = '';
      let result = '';
      const text = resourceContent[i];
      // 来源类型
      const originTypeMatch = text.match(/data-originType="(.*)?"/i);
      // 资源类型
      const resourceTypeMatch = text.match(
        /data-resourceType="\[("|&#34;)(([^"][^&#34;])*)?("|&#34;)/i,
      );
      if (Number(originTypeMatch![1]) === 1) {
        // 来自资源
        // 资源名称
        const resourceNameMatch = text.match(/data-resourceName="(.*)?"/i);
        replaceUrl = `freelog://${resourceNameMatch![1]}`;
      } else if (Number(originTypeMatch![1]) === 2) {
        // 来自对象或 url
        // 内容（url）
        const contentMatch = text.match(/data-content="(.*)?"/i);
        replaceUrl = contentMatch![1];
      } else if (Number(originTypeMatch![1]) === 3) {
        // 无效资源
        // 将无效的资源名称作为url
        const resourceNameMatch = text.match(/data-resourceName="(.*)?"/i);
        replaceUrl = 'freelog://' + resourceNameMatch![1];
      }
      // 转化依赖语法
      if (resourceTypeMatch![2] === '图片') {
        result = `<img src='${replaceUrl}' />`;
      } else if (resourceTypeMatch![2] === '视频') {
        result = `<video controls src='${replaceUrl}' />`;
      } else if (resourceTypeMatch![2] === '音频') {
        result = `<audio controls src='${replaceUrl}' />`;
      } else if (resourceTypeMatch![2] === '阅读') {
        result = `{{${replaceUrl}}}`;
      }
      // 将图片文本替换标记
      markdownText = markdownText.replace(/`#resourceContent#`/i, result);
    }
  }

  return markdownText;
};

/** 清除所有 HTML 标签 */
const clearHtmlTag = (str = '') => {
  return str.replace(/<[\s\S]*?>/g, '');
};

/** 构建 md 格式的 table */
const buildTable = (tableData: any[] | null = null) => {
  if (!tableData) return;

  let result = '';

  // 不存在 th 标签，则视表格为一层处理
  if (!tableData[0].length) {
    const colNum = tableData[1].length;
    for (let i = 0; i < colNum; i++) {
      result += `|${clearHtmlTag(tableData[1][i])}`;
    }
    result += `|[~wrap]`;
    for (let i = 0; i < colNum; i++) {
      result += `| :-- `;
    }
    result += `|[~wrap]`;
    return result;
  }

  // 存在 th 标签，按 th 的格数为列数构建整个表格
  const colNum = tableData[0].length;
  for (let i = 0; i < colNum; i++) {
    result += `|${clearHtmlTag(tableData[0][i])}`;
  }
  result += `|[~wrap]`;
  for (let i = 0; i < colNum; i++) {
    result += `| :-- `;
  }
  result += `|[~wrap]`;
  for (let i = 0; i < tableData[1].length; ) {
    for (let j = 0; j < colNum; j++, i++) {
      result += `|${clearHtmlTag(tableData[1][i])}`;
    }
    result += `|[~wrap]`;
  }
  return result + `[~wrap]`;
};

/** 匹配所有遍历处理 */
const matchAllStep = (
  iterator: IterableIterator<RegExpMatchArray>,
  markdownText: string,
): string => {
  const step = iterator.next();
  if (step.done) return markdownText;

  markdownText = markdownText.replace(step.value[1], '');
  return matchAllStep(iterator, markdownText);
};

/** 获取匹配所有内容 */
const getMatchAllContent = (
  iterator: IterableIterator<RegExpMatchArray>,
  arr: string[],
  reg: RegExp,
) => {
  const step = iterator.next();
  if (step.done) return;

  const content = step.value[0].match(reg);
  arr.push(content![1]);
  getMatchAllContent(iterator, arr, reg);
};

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
  // 标记原文本中 <pre> 的内容
  markdownText = markdownText.replace(
    /(?<=<pre\s*[^>]*?>)[\s\S]*?(?=<\/pre>)/gi,
    '`#preContent#`',
  );
  // 存在 <pre>
  if (preContent && preContent.length) {
    for (let i = 0; i < preContent.length; i++) {
      const text = preContent[i];
      // 匹配代码块的语言
      const languageMatch = text.match(/(?<=language-).*?(?=[\s'"])/i) || [];
      // 获取代码块的语言
      const language =
        languageMatch && languageMatch[0]
          ? `${languageMatch[0]}[~wrap]`
          : '[~wrap]';
      // 去掉多余标签获得内容
      const content = clearHtmlTag(text);
      // 将内容替换标记
      markdownText = markdownText.replace(
        /`#preContent#`/i,
        language + content,
      );
    }
    // 清除 <pre>、</pre> 标签
    markdownText = markdownText
      .replace(/<pre\s*[^>]*?>/gi, '```')
      .replace(/<\/pre>/gi, '[~wrap]```[~wrap][~wrap]');
  }

  // 储存 <code> 内容
  codeContent =
    markdownText.match(/(?<=<code\s*[^>]*?>)[\s\S]*?(?=<\/code>)/gi) || [];
  // 标记原文本中 <code> 的内容
  markdownText = markdownText.replace(
    /(?<=<code\s*[^>]*?>)[\s\S]*?(?=<\/code>)/gi,
    '`#codeContent#`',
  );
  // 存在 <code>
  if (codeContent) {
    for (let i = 0; i < codeContent.length; i++) {
      const text = codeContent[i];
      // 去掉多余标签获得内容
      const content = clearHtmlTag(text);
      // 将内容替换标记
      markdownText = markdownText.replace(/`#codeContent#`/i, content);
    }
    // 清除 <code>、</code> 标签
    markdownText = markdownText
      .replace(/<code>/gi, '`')
      .replace(/<\/code>/gi, '`');
  }

  // 储存 <a> 内容
  aContent = markdownText.match(/<a\s*[^>]*?>[^]*?<\/a>/gi) || [];
  // 标记原文本中 <a> 的内容
  markdownText = markdownText.replace(
    /<a\s*[^>]*?>[^]*?<\/a>/gi,
    '`#aContent#`',
  );
  // 存在 <a>
  if (aContent) {
    for (let i = 0; i < aContent.length; i++) {
      const text = aContent[i];
      // 获取链接地址
      const href = text.match(/(?<=href=['"])[\s\S]*?(?=['"])/i);
      // 去掉多余标签获得链接描述
      const title = clearHtmlTag(text);
      // 拼接链接文本
      const result = `[${title}](${href})`;
      // 将链接文本替换标记
      markdownText = markdownText.replace(/`#aContent#`/i, result);
    }
  }

  // 储存 <img> 内容
  imgContent = markdownText.match(/<img\s*[^>]*?>[^]*?(<\/img>)?/gi) || [];
  // 标记原文本中 <img> 的内容
  markdownText = markdownText.replace(
    /<img\s*[^>]*?>[^]*?(<\/img>)?/gi,
    '`#imgContent#`',
  );
  // 存在 <img>
  if (imgContent) {
    for (let i = 0; i < imgContent.length; i++) {
      const text = imgContent[i];
      // 获取图片地址
      const src = text.match(/(?<=src=['"])[\s\S]*?(?=['"])/i);
      // 获取图片描述
      const alt = text.match(/(?<=alt=['"])[\s\S]*?(?=['"])/i);
      // 拼接图片文本
      const result = `![${alt}](${src})`;
      // 将图片文本替换标记
      markdownText = markdownText.replace(/`#imgContent#`/i, result);
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
  markdownText = markdownText.replace(/(?<=<[a-zA-Z0-9]*)\s.*?(?=>)/g, '');

  // <h1><h2>...等标题标签转为 #
  markdownText = markdownText
    .replace(/<h1>/gi, '[~wrap]# ')
    .replace(/<\/h1>/gi, '[~wrap][~wrap]')
    .replace(/<h2>/gi, '[~wrap]## ')
    .replace(/<\/h2>/gi, '[~wrap][~wrap]')
    .replace(/<h3>/gi, '[~wrap]### ')
    .replace(/<\/h3>/gi, '[~wrap][~wrap]')
    .replace(/<h4>/gi, '[~wrap]#### ')
    .replace(/<\/h4>/gi, '[~wrap][~wrap]')
    .replace(/<h5>/gi, '[~wrap]##### ')
    .replace(/<\/h5>/gi, '[~wrap][~wrap]')
    .replace(/<h6>/gi, '[~wrap]###### ')
    .replace(/<\/h6>/gi, '[~wrap][~wrap]');

  // 处理一些常用的结构标签
  markdownText = markdownText
    .replace(/<br>/gi, '[~wrap]')
    .replace(/<\/p>|<br\/>|<\/div>/gi, '[~wrap][~wrap]')
    .replace(/<meta>|<span>|<p>|<div>|<\/span>/gi, '');

  // 分割线：将 <hr> 转为 ---
  markdownText = markdownText.replace(/<hr>|<hr\/>/gi, '---[~wrap][~wrap]');

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
    .replace(/<blockquote>/gi, '[~wrap]> ')
    .replace(/<\/blockquote>/gi, '[~wrap][~wrap]');

  // 储存 <table> 内容
  tableContent =
    markdownText.match(/(?<=<table\s*[^>]*?>)[\s\S]*?(?=<\/table>)/gi) || [];
  // 标记原文本中 <table> 的内容
  markdownText = markdownText.replace(
    /<table\s*[^>]*?>[^]*?<\/table>/gi,
    '`#tableContent#`',
  );
  // 存在 <table>
  if (tableContent) {
    const tableDataList = [];
    for (let i = 0; i < tableContent.length; i++) {
      const text = tableContent[i];
      // 创建表格内容容器
      tableDataList[i] = [] as any[];
      // 表格表头
      tableDataList[i].push(text.match(/(?<=<th>)[\s\S]*?(?=<\/th?>)/gi));
      // 表格内容
      tableDataList[i].push(text.match(/(?<=<td>)[\s\S]*?(?=<\/td?>)/gi));
    }
    // 存在表格
    if (tableDataList.length) {
      for (let i = 0; i < tableDataList.length; i++) {
        // 构建表格
        const result = buildTable(tableDataList[i]) || '';
        markdownText = markdownText.replace(/`#tableContent#`/i, result);
      }
    }
  }

  // 储存 <ol> 内容
  olContent =
    markdownText.match(/(?<=<ol\s*[^>]*?>)[\s\S]*?(?=<\/ol>)/gi) || [];
  // 标记原文本中 <ol> 的内容
  markdownText = markdownText.replace(
    /(?<=<ol\s*[^>]*?>)[\s\S]*?(?=<\/ol>)/gi,
    '`#olContent#`',
  );
  // 存在 <ol>
  if (olContent) {
    for (let i = 0; i < olContent.length; i++) {
      const text = olContent[i];
      let result = text;
      // 获取列表列数
      const num = (text.match(/<li>/gi) || []).length;
      for (let i = 1; i <= num; i++) {
        // 清除 <li> 标签
        result = result
          .replace(/<li>/i, `[~wrap]${i}. `)
          .replace(/<\/li>/, '[~wrap][~wrap]');
      }
      markdownText = markdownText.replace(
        /`#olContent#`/i,
        clearHtmlTag(result),
      );
    }
  }

  // 无序列表：将 <li>、<dd> 转为 -
  markdownText = markdownText
    .replace(/<li>|<dd>/gi, '[~wrap] - ')
    .replace(/<\/li>|<\/dd>/gi, '[~wrap][~wrap]');

  // 换行处理：将换行标记 [~wrap] 转为为 \n，删除多余换行，删除首行换行
  markdownText = markdownText
    .replace(/\[~wrap\]/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n{1,}/i, '');

  // 清除剩余 html 标签
  markdownText = clearHtmlTag(markdownText);

  // 还原原文本中的 < 和 > 符号
  markdownText = markdownText.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');

  // 存在资源
  if (resourceContent) {
    for (let i = 0; i < resourceContent.length; i++) {
      let replaceUrl = '';
      let result = '';
      const text = resourceContent[i];
      // 来源类型
      const originType = text.match(
        /(?<=data-originType=['"])[\s\S]*?(?=['"])/i,
      );
      // 资源类型
      const resourceType =
        text.match(/(?<=data-resourceType="\[")[\s\S]*?(?=")/i) || [];
      if (Number(originType) === 1) {
        // 来自资源
        // 资源名称
        const resourceName = text.match(
          /(?<=data-resourceName=['"])[\s\S]*?(?=['"])/i,
        );
        replaceUrl = `freelog://${resourceName}`;
      } else if (Number(originType) === 2) {
        // 来自对象或 url
        // 内容（url）
        const content =
          text.match(/(?<=data-content=['"])[\s\S]*?(?=['"])/i) || [];
        replaceUrl = content[0];
      } else if (Number(originType) === 3) {
        // 无效资源
        // 将无效的资源名称作为url
        const content =
          text.match(/(?<=data-resourceName=['"])[\s\S]*?(?=['"])/i) || [];
        replaceUrl = 'freelog://' + content[0];
      }
      // 转化依赖语法
      if (resourceType[0] === '图片') {
        result = `<img src='${replaceUrl}' />`;
      } else if (resourceType[0] === '视频') {
        result = `<video controls src='${replaceUrl}' />`;
      } else if (resourceType[0] === '音频') {
        result = `<audio controls src='${replaceUrl}' />`;
      } else if (resourceType[0] === '阅读') {
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
  if (!tableData[0]) {
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

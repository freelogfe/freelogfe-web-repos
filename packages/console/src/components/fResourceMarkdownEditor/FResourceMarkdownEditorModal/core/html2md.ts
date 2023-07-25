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
    .replace(new RegExp(/<style\s*[^>]*?>[^]*?<\/style>/gi), '')
    .replace(new RegExp(/<script\s*[^>]*?>[^]*?<\/script>/gi), '');

  // 储存 <pre> 内容
  preContent = markdownText.match(new RegExp(/<pre\s*[^>]*?>[^]*?<\/pre>/gi)) || [];
  // 标记原文本中 <pre> 的内容
  markdownText = markdownText.replace(
    new RegExp(/(?<=<pre\s*[^>]*?>)[\s\S]*?(?=<\/pre>)/gi),
    '`#preContent#`',
  );
  // 存在 <pre>
  if (preContent && preContent.length) {
    for (let i = 0; i < preContent.length; i++) {
      const text = preContent[i];
      // 匹配代码块的语言
      const languageMatch = text.match(new RegExp(/(?<=language-).*?(?=[\s'"])/i)) || [];
      // 获取代码块的语言
      const language =
        languageMatch && languageMatch[0]
          ? `${languageMatch[0]}[~wrap]`
          : '[~wrap]';
      // 去掉多余标签获得内容
      const content = clearHtmlTag(text);
      // 将内容替换标记
      markdownText = markdownText.replace(
        new RegExp(/`#preContent#`/i),
        language + content,
      );
    }
    // 清除 <pre>、</pre> 标签
    markdownText = markdownText
      .replace(new RegExp(/<pre\s*[^>]*?>/gi), '```')
      .replace(new RegExp(/<\/pre>/gi), '[~wrap]```[~wrap][~wrap]');
  }

  // 储存 <code> 内容
  codeContent =
    markdownText.match(new RegExp(/(?<=<code\s*[^>]*?>)[\s\S]*?(?=<\/code>)/gi)) || [];
  // 标记原文本中 <code> 的内容
  markdownText = markdownText.replace(
    new RegExp(/(?<=<code\s*[^>]*?>)[\s\S]*?(?=<\/code>)/gi),
    '`#codeContent#`',
  );
  // 存在 <code>
  if (codeContent) {
    for (let i = 0; i < codeContent.length; i++) {
      const text = codeContent[i];
      // 去掉多余标签获得内容
      const content = clearHtmlTag(text);
      // 将内容替换标记
      markdownText = markdownText.replace(new RegExp(/`#codeContent#`/i), content);
    }
    // 清除 <code>、</code> 标签
    markdownText = markdownText
      .replace(new RegExp(/<code>/gi), '`')
      .replace(new RegExp(/<\/code>/gi), '`');
  }

  // 储存 <a> 内容
  aContent = markdownText.match(new RegExp(/<a\s*[^>]*?>[^]*?<\/a>/gi)) || [];
  // 标记原文本中 <a> 的内容
  markdownText = markdownText.replace(
    new RegExp(/<a\s*[^>]*?>[^]*?<\/a>/gi),
    '`#aContent#`',
  );
  // 存在 <a>
  if (aContent) {
    for (let i = 0; i < aContent.length; i++) {
      const text = aContent[i];
      // 获取链接地址
      const href = text.match(new RegExp(/(?<=href=['"])[\s\S]*?(?=['"])/i));
      // 去掉多余标签获得链接描述
      const title = clearHtmlTag(text);
      // 拼接链接文本
      const result = `[${title}](${href})`;
      // 将链接文本替换标记
      markdownText = markdownText.replace(new RegExp(/`#aContent#`/i), result);
    }
  }

  // 储存 <img> 内容
  imgContent = markdownText.match(new RegExp(/<img\s*[^>]*?>[^]*?(<\/img>)?/gi)) || [];
  // 标记原文本中 <img> 的内容
  markdownText = markdownText.replace(
    new RegExp(/<img\s*[^>]*?>[^]*?(<\/img>)?/gi),
    '`#imgContent#`',
  );
  // 存在 <img>
  if (imgContent) {
    for (let i = 0; i < imgContent.length; i++) {
      const text = imgContent[i];
      // 获取图片地址
      const src = text.match(new RegExp(/(?<=src=['"])[\s\S]*?(?=['"])/i));
      // 获取图片描述
      const alt = text.match(new RegExp(/(?<=alt=['"])[\s\S]*?(?=['"])/i));
      // 拼接图片文本
      const result = `![${alt}](${src})`;
      // 将图片文本替换标记
      markdownText = markdownText.replace(new RegExp(/`#imgContent#`/i), result);
    }
  }

  // 储存资源内容（<span data-w-e-type="resource"）
  resourceContent =
    markdownText.match(
      new RegExp(/<span\s*data-w-e-type="resource"[^>]*?>[^]*?<\/span>/gi),
    ) || [];
  // 标记原文本中资源内容
  markdownText = markdownText.replace(
    new RegExp(/<span\s*data-w-e-type="resource"[^>]*?>[^]*?<\/span>/gi),
    '`#resourceContent#`',
  );

  // 获取纯净（无属性）的 html
  markdownText = markdownText.replace(new RegExp(/(?<=<[a-zA-Z0-9]*)\s.*?(?=>)/g), '');

  // <h1><h2>...等标题标签转为 #
  markdownText = markdownText
    .replace(new RegExp(/<h1>/gi), '[~wrap]# ')
    .replace(new RegExp(/<\/h1>/gi), '[~wrap][~wrap]')
    .replace(new RegExp(/<h2>/gi), '[~wrap]## ')
    .replace(new RegExp(/<\/h2>/gi), '[~wrap][~wrap]')
    .replace(new RegExp(/<h3>/gi), '[~wrap]### ')
    .replace(new RegExp(/<\/h3>/gi), '[~wrap][~wrap]')
    .replace(new RegExp(/<h4>/gi), '[~wrap]#### ')
    .replace(new RegExp(/<\/h4>/gi), '[~wrap][~wrap]')
    .replace(new RegExp(/<h5>/gi), '[~wrap]##### ')
    .replace(new RegExp(/<\/h5>/gi), '[~wrap][~wrap]')
    .replace(new RegExp(/<h6>/gi), '[~wrap]###### ')
    .replace(new RegExp(/<\/h6>/gi), '[~wrap][~wrap]');

  // 处理一些常用的结构标签
  markdownText = markdownText
    .replace(new RegExp(/<br>/gi), '[~wrap]')
    .replace(new RegExp(/<\/p>|<br\/>|<\/div>/gi), '[~wrap][~wrap]')
    .replace(new RegExp(/<meta>|<span>|<p>|<div>|<\/span>/gi), '');

  // 分割线：将 <hr> 转为 ---
  markdownText = markdownText.replace(new RegExp(/<hr>|<hr\/>/gi), '---[~wrap][~wrap]');

  // 粗体：将 <b>、<strong> 转为 **
  markdownText = markdownText.replace(new RegExp(/<b>|<strong>|<\/b>|<\/strong>/gi), '**');

  // 斜体：将 <i>、<em>、<abbr>、<dfn>、<cite>、<address> 转为 *
  markdownText = markdownText.replace(
    new RegExp(/<i>|<em>|<abbr>|<dfn>|<cite>|<address>|<\/i>|<\/em>|<\/abbr>|<\/dfn>|<\/cite>|<\/address>/gi),
    '*',
  );

  // 删除线：将 <s>、<del> 转为 ~~
  markdownText = markdownText.replace(new RegExp(/<del>|<s>|<\/del>|<\/s>/gi), '~~');

  // 引用：将 <blockquote> 转为 >
  markdownText = markdownText
    .replace(new RegExp(/<blockquote>/gi), '[~wrap]> ')
    .replace(new RegExp(/<\/blockquote>/gi), '[~wrap][~wrap]');

  // 储存 <table> 内容
  tableContent =
    markdownText.match(new RegExp(/(?<=<table\s*[^>]*?>)[\s\S]*?(?=<\/table>)/gi)) || [];
  // 标记原文本中 <table> 的内容
  markdownText = markdownText.replace(
    new RegExp(/<table\s*[^>]*?>[^]*?<\/table>/gi),
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
      tableDataList[i].push(text.match(new RegExp(/(?<=<th>)[\s\S]*?(?=<\/th?>)/gi)));
      // 表格内容
      tableDataList[i].push(text.match(new RegExp(/(?<=<td>)[\s\S]*?(?=<\/td?>)/gi)));
    }
    // 存在表格
    if (tableDataList.length) {
      for (let i = 0; i < tableDataList.length; i++) {
        // 构建表格
        const result = buildTable(tableDataList[i]) || '';
        markdownText = markdownText.replace(new RegExp(/`#tableContent#`/i), result);
      }
    }
  }

  // 储存 <ol> 内容
  olContent =
    markdownText.match(new RegExp(/(?<=<ol\s*[^>]*?>)[\s\S]*?(?=<\/ol>)/gi)) || [];
  // 标记原文本中 <ol> 的内容
  markdownText = markdownText.replace(
    new RegExp(/(?<=<ol\s*[^>]*?>)[\s\S]*?(?=<\/ol>)/gi),
    '`#olContent#`',
  );
  // 存在 <ol>
  if (olContent) {
    for (let i = 0; i < olContent.length; i++) {
      const text = olContent[i];
      let result = text;
      // 获取列表列数
      const num = (text.match(new RegExp(/<li>/gi)) || []).length;
      for (let i = 1; i <= num; i++) {
        // 清除 <li> 标签
        result = result
          .replace(new RegExp(/<li>/i), `[~wrap]${i}. `)
          .replace(new RegExp(/<\/li>/), '[~wrap][~wrap]');
      }
      markdownText = markdownText.replace(
        new RegExp(/`#olContent#`/i),
        clearHtmlTag(result),
      );
    }
  }

  // 无序列表：将 <li>、<dd> 转为 -
  markdownText = markdownText
    .replace(new RegExp(/<li>|<dd>/gi), '[~wrap] - ')
    .replace(new RegExp(/<\/li>|<\/dd>/gi), '[~wrap][~wrap]');

  // 换行处理：将换行标记 [~wrap] 转为为 \n，删除多余换行，删除首行换行
  markdownText = markdownText
    .replace(new RegExp(/\[~wrap\]/gi), '\n')
    .replace(new RegExp(/\n{3,}/g), '\n\n')
    .replace(new RegExp(/^\n{1,}/i), '');

  // 清除剩余 html 标签
  markdownText = clearHtmlTag(markdownText);

  // 还原原文本中的 < 和 > 符号
  markdownText = markdownText.replace(new RegExp(/&lt;/gi), '<').replace(new RegExp(/&gt;/gi), '>');

  // 存在资源
  if (resourceContent) {
    for (let i = 0; i < resourceContent.length; i++) {
      let replaceUrl = '';
      let result = '';
      const text = resourceContent[i];
      // 来源类型
      const originType = text.match(
        new RegExp( /(?<=data-originType=['"])[\s\S]*?(?=['"])/i),
      );
      // 资源类型
      const resourceType =
        text.match(new RegExp(/(?<=data-resourceType="\[")[\s\S]*?(?=")/i)) || [];
      if (Number(originType) === 1) {
        // 来自资源
        // 资源名称
        const resourceName = text.match(
          new RegExp(/(?<=data-resourceName=['"])[\s\S]*?(?=['"])/i),
        );
        replaceUrl = `freelog://${resourceName}`;
      } else if (Number(originType) === 2) {
        // 来自对象或 url
        // 内容（url）
        const content =
          text.match(new RegExp(/(?<=data-content=['"])[\s\S]*?(?=['"])/i)) || [];
        replaceUrl = content[0];
      } else if (Number(originType) === 3) {
        // 无效资源
        // 将无效的资源名称作为url
        const content =
          text.match(new RegExp(/(?<=data-resourceName=['"])[\s\S]*?(?=['"])/i)) || [];
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
      markdownText = markdownText.replace(new RegExp(/`#resourceContent#`/i), result);
    }
  }

  return markdownText;
};

/** 清除所有 HTML 标签 */
const clearHtmlTag = (str = '') => {
  return str.replace(new RegExp(/<[\s\S]*?>/g), '');
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

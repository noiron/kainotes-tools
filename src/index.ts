import * as path from 'path';

/**
 * 判断一个文件是否为 markdown 文件
 */
export const isMarkdownFile = (filePath: string) => {
  const extname = path.extname(filePath).toLowerCase();
  return extname === '.md' || extname === '.markdown';
};

/**
 * 在标签文字的获取过程中，可能会带上开头的 #，统一用这个函数去处理
 */
export const purifyTag = (tag: string) => {
  if (typeof tag !== 'string' || tag.length === 0) return '';
  if (tag[0] !== '#') return tag;
  return tag.slice(1);
};

/**
 * 从文件内容中获得文件标题，一般为文件的第一行，以 # 开头
 */
export function extractTitleFromContent(content: string) {
  const lines = content.split('\n');
  let i = 0;
  while (lines[i].trim() === '') {
    i++;
  }
  const firstLine = lines[i];
  if (firstLine.startsWith('# ')) {
    return firstLine.substring(2).trim();
  }
  return '';
}

// (?<=^|\s) positive lookbehind - hash must be start of a line or have space before it
// (?!\s|#|!|\d) negative lookahead - space, #, !, numbers can't be after hash
const MARKDOWN_REGEX = /(?<=^|\s)#(?!\s|#|!|\d)([\S]+)/gm;

/**
 * 检查给定的内容中是否包含标签，并提取出来
 */
export const extractTagsFromContent = (content: string) => {
  const tags = content.match(MARKDOWN_REGEX);
  if (!tags) {
    return null;
  }
  // 去除重复的标签
  return [...new Set(tags.map(purifyTag))];
};

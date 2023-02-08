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

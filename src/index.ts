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

const ALL_TAGS = '__ALL__';

/**
 * 在文件列表中查找包含给定标签的文件
 * @param folderPath {string} 文件夹路径
 * @param fileList {string[]} 文件路径列表
 * @param searchTag {string} 要查找的标签
 * @returns
 */
export async function getFilesContainTag(
  folderPath: string,
  fileList: string[],
  searchTag: string,
  extractFileTags: (filePath: string) => Promise<string[]> | string[]
) {
  const list: string[] = [];
  const promises = fileList.filter(isMarkdownFile).map(async (absolutePath) => {
    const tagsInFile = await extractFileTags(absolutePath);
    const relativePath = path.relative(folderPath, absolutePath);

    if (searchTag === ALL_TAGS) {
      list.push(relativePath);
    } else if (tagsInFile) {
      for (const tag of tagsInFile) {
        if (tag === searchTag) {
          list.push(relativePath);
          break;
        }
      }
    } else if (!searchTag) {
      // 查找所有不包含标签的文件
      list.push(relativePath);
    }
  });
  await Promise.all(promises);
  return list;
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";

import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // /posts　配下のファイル名を取得する
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // id を取得するためにファイル名から ".md" を削除する
    const id = fileName.replace(/\.md$/, "");

    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 投稿のメタデータ部分を解析するために gray-matter を使う
    const matterResult = matter(fileContents);

    // データを id と合わせる
    return {
      id,
      ...matterResult.data,
    };
  });
  // 投稿を日付でソートする
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  // console.log(matterResult);
  // {
  //   content: '\n' +
  //     'We recommend using **Static Generation** (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.\n' +
  //     '\n' +
  //     'You can use Static Generation for many types of pages, including:\n' +
  //     '\n' +
  //     '- Marketing pages\n' +
  //     '- Blog posts\n' +
  //     '- E-commerce product listings\n' +
  //     '- Help and documentation\n' +
  //     '\n' +
  //     `You should ask yourself: "Can I pre-render this page **ahead** of a user's request?" If the answer is yes, then you should choose Static Generation.\n` +
  //     '\n' +
  //     "On the other hand, Static Generation is **not** a good idea if you cannot pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.\n" +
  //     '\n' +
  //     'In that case, you can use **Server-Side Rendering**. It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate data.',
  //   data: {
  //     title: 'When to Use Static Generation v.s. Server-side Rendering',
  //     date: '2020-01-02'
  //   },
  //   isEmpty: false,
  //   excerpt: '',
  //   orig: <Buffer 2d 2d 2d 0a 74 69 74 6c 65 3a 20 27 57 68 65 6e 20 74 6f 20 55 73 65 20 53 74 61 74 69 63 20 47 65 6e 65 72 61 74 69 6f 6e 20 76 2e 73 2e 20 53 65 72 ... 986 more bytes>
  // }

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  // console.log(processedContent);
  // VFile {
  //   data: {},
  //   messages: [],
  //   history: [],
  //   cwd: '/Users/shiga/src/github.com/shigasy/next-tutorial',
  //   contents: '<p>We recommend using <strong>Static Generation</strong> (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.</p>\n' +
  //     '<p>You can use Static Generation for many types of pages, including:</p>\n' +
  //     '<ul>\n' +
  //     '<li>Marketing pages</li>\n' +
  //     '<li>Blog posts</li>\n' +
  //     '<li>E-commerce product listings</li>\n' +
  //     '<li>Help and documentation</li>\n' +
  //     '</ul>\n' +
  //     `<p>You should ask yourself: "Can I pre-render this page <strong>ahead</strong> of a user's request?" If the answer is yes, then you should choose Static Generation.</p>\n` +
  //     "<p>On the other hand, Static Generation is <strong>not</strong> a good idea if you cannot pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.</p>\n" +
  //     '<p>In that case, you can use <strong>Server-Side Rendering</strong>. It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate data.</p>\n'
  // }
  const contentHtml = processedContent.toString();
  // console.log(contentHtml);
  //   <p>We recommend using <strong>Static Generation</strong> (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.</p>
  // <p>You can use Static Generation for many types of pages, including:</p>
  // <ul>
  // <li>Marketing pages</li>
  // <li>Blog posts</li>
  // <li>E-commerce product listings</li>
  // <li>Help and documentation</li>
  // </ul>
  // <p>You should ask yourself: "Can I pre-render this page <strong>ahead</strong> of a user's request?" If the answer is yes, then you should choose Static Generation.</p>
  // <p>On the other hand, Static Generation is <strong>not</strong> a good idea if you cannot pre-render a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.</p>
  // <p>In that case, you can use <strong>Server-Side Rendering</strong>. It will be slower, but the pre-rendered page will always be up-to-date. Or you can skip pre-rendering and use client-side JavaScript to populate data.</p>

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

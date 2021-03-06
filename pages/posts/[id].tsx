import Layout from "../../components/layout";
import Head from "next/head";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { useEffect } from "react";
import { useState } from "react";
import React from "react";

const fetchNextJsStar = async () => {
  const res = await fetch("/api/hello");
  const json = await res.json();
  return json.text;
};

export default function Post({
  postData,
}: {
  postData: { date: string; title: string; id: string; contentHtml: string };
}) {
  const [hello, setHello] = useState("");
  useEffect(() => {
    (async () => {
      setHello(await fetchNextJsStar());
    })();
  }, []);
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        {hello}
        <hr />
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

// paramsはurlのidが入る
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

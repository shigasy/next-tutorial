import Head from "next/head";
import Layout, { siteTime } from "../components/layout";
import Link from "next/link";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import fetch from "node-fetch";
import { GetStaticProps } from "next";

export default function Home({
  allPostsData,
  nextStart,
}: {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
  nextStart: number;
}) {
  return (
    <Layout home>
      <Head>
        <title>Create Next App Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Next.js Start: {nextStart}</p>
        <p>[Your Self Introduction]</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="posts/[id]" as={`posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
      <Link href="users/user">
        <a>user</a>
      </Link>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  const res = await fetch("https://api.github.com/repos/zeit/next.js");
  const json = await res.json();
  const nextStart = json.stargazers_count;
  return {
    props: {
      allPostsData,
      nextStart,
    },
  };
};

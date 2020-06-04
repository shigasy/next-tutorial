import Layout from "../../components/layout";
import { useEffect } from "react";
import { useState } from "react";
import fetch from "node-fetch";
import { GetServerSideProps } from "next";

const fetchNextJsStar = async () => {
  const res = await fetch("http://www.mocky.io/v2/5ed897933100006700c4e577");
  const json = await res.json();
  return json.hello;
};

export default function Post({ text }: { text: string }) {
  const [hello, setHello] = useState("");
  useEffect(() => {
    (async () => {
      setHello(await fetchNextJsStar());
    })();
  }, []);
  return (
    <Layout>
      <article>
        <p>useEffectで取得: {hello}</p>
        <hr />
        <p>SSRで取得: {text}</p>
      </article>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const text = await fetchNextJsStar();
  return {
    props: {
      text,
    }, // will be passed to the page component as props
  };
};

import Layout from "../../components/layout";
import { useEffect } from "react";
import { useState } from "react";
import fetch from "node-fetch";

const fetchNextJsStar = async () => {
  const res = await fetch("http://www.mocky.io/v2/5ed897933100006700c4e577");
  const json = await res.json();
  return json.hello;
};

export default function Post({ text }) {
  const [hello, setHello] = useState("");
  useEffect(() => {
    (async () => {
      setHello(await fetchNextJsStar());
    })();
  }, []);
  return (
    <Layout>
      <article>
        {hello}
        {text}
        <hr />
      </article>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  console.log(context);
  const text = await fetchNextJsStar();
  return {
    props: {
      text,
    }, // will be passed to the page component as props
  };
}

import React from "react";
import { IParticlesParams } from "react-particles-js";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import { mdiApple, mdiGithub, mdiLinux, mdiMicrosoftWindows } from "@mdi/js";
import Head from "next/head";
import ProgressiveImage from "react-progressive-image";
import axios from "axios";

const Particles = dynamic(() => import("react-particles-js"), {
  ssr: false,
});

const params: IParticlesParams = {
  detectRetina: true,
  particles: {
    opacity: {
      value: 0.1,
    },
    number: {
      value: 100,
    },
    lineLinked: { enable: false },
    size: {
      value: 5,
    },
  },
};

export async function getStaticProps() {
  const { data } = await axios.get(
    "https://api.github.com/repos/ritz078/moose/releases/latest"
  );
  return {
    props: {
      macUrl:
        data.assets.find((assets) => assets.name.endsWith(".dmg"))
          ?.browser_download_url || "",
      linuxUrl:
        data.assets.find((assets) => assets.name.endsWith(".AppImage"))
          ?.browser_download_url || "",
    },
  };
}

export default ({ macUrl, linuxUrl }) => {
  return (
    <div className="wrapper">
      <Head>
        <title>moose</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="A torrent client to download, stream and cast torrents."
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ritz078" />
        <meta property="og:url" content="https://getmoose.in" />
        <meta property="og:title" content="moose" />
        <meta
          property="og:description"
          content="A torrent client to download, stream and cast torrents."
        />
        <meta property="og:image" content="https://getmoose.in/favicon.png" />
      </Head>
      <Particles className={"particles"} params={params} />

      <div className="banner">
        <div className="top-section">
          <div>
            <img className="logo" src="/logo.svg" alt="" />

            <span>A torrent client to download, stream and cast torrents.</span>

            <div className="downloads">
              <a href={macUrl} target="_blank">
                <button className="download-button">
                  <Icon path={mdiApple} size={1.2} />
                </button>
              </a>
              <button title="Coming soon" disabled className="download-button">
                <Icon path={mdiMicrosoftWindows} size={1.2} />
              </button>
              <a href={linuxUrl} target="_blank">
                <button className="download-button">
                  <Icon path={mdiLinux} size={1.2} />
                </button>
              </a>
              <a href="https://github.com/ritz078/moose" target="_blank">
                <button className="download-button">
                  <Icon path={mdiGithub} size={1.2} />
                </button>
              </a>
            </div>
          </div>
        </div>

        <ProgressiveImage src="/demo.png" placeholder="/demo-small.png">
          {(src) => (
            <div className="demo-wrapper">
              <div
                className="demo"
                style={{
                  backgroundImage: `url(${src})`,
                }}
              />
            </div>
          )}
        </ProgressiveImage>
      </div>

      <footer>
        Made by &nbsp; <a href="https://twitter.com/ritz078">@ritz078</a>
      </footer>
    </div>
  );
};

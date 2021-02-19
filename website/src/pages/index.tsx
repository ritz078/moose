import React, { useState } from "react";
import { IParticlesParams } from "react-particles-js";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import {
  mdiApple,
  mdiConsoleNetworkOutline,
  mdiGithub,
  mdiLinux,
  mdiMicrosoftWindows,
} from "@mdi/js";
import Head from "next/head";
import ProgressiveImage from "react-progressive-image";
import platform from "platform";
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
  // Download-button React Component
  function DownloadButton(props) {
    if (props.type === "box-button") {
      return !props.disabled ? (
        <a className="downloads" href={props.url} target="_blank">
          <button className="download-button">
            Download moose for&nbsp;<b>{props.name}</b>
          </button>
        </a>
      ) : (
        <a className="downloads">
          <button key={props.key} title="Coming soon" disabled>
            Download moose for&nbsp;<b>{props.name}</b>
          </button>
        </a>
      );
    } else if (props.type == "icon-button") {
      return !props.disabled ? (
        <a key={props.key} href={props.url} target="_blank">
          <button className="download-button">
            <Icon path={props.logo} size={1.2} />
          </button>
        </a>
      ) : (
        <button
          key={props.key}
          title="Coming soon"
          disabled
          className="download-button"
        >
          <Icon path={props.logo} size={1.2} />
        </button>
      );
    }
  }

  function DownloadAll(props) {
    const [clicked, setClicked] = useState(false);

    return clicked ? (
      <ul className="downloads-all">
        <li key={"OS X_"}>
          <DownloadButton
            url={macUrl}
            logo={mdiApple}
            disabled={false}
            type="icon-button"
          />
        </li>
        <li key={"Windows_"}>
          <DownloadButton
            logo={mdiMicrosoftWindows}
            disabled={true}
            type="icon-button"
          />
        </li>
        <li key={"Linux_"}>
          <DownloadButton
            url={linuxUrl}
            logo={mdiLinux}
            disabled={false}
            type="icon-button"
          />
        </li>
        <li key={"Github"}>
          <DownloadButton
            url="https://github.com/ritz078/moose"
            logo={mdiGithub}
            disabled={false}
            type="icon-button"
          />
        </li>
      </ul>
    ) : (
      <a
        className="downloads-all-link"
        onClick={() => {
          setClicked(true);
        }}
      >
        Download for other platforms
      </a>
    );
  }

  console.log(`family: ${platform.os.family}`);

  var flag =
    platform.os.family.match(/Win/i) ||
    platform.os.family.match(/OS X/i) ||
    platform.os.family.match(/Linux/i);

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

            {flag && (
              <>
                {platform.os.family.match(/Win/i) && (
                  <DownloadButton
                    name="Windows"
                    disabled={true}
                    type="box-button"
                  />
                )}
                {platform.os.family.match(/OS X/i) && (
                  <DownloadButton
                    name="Mac OS"
                    disabled={false}
                    url={macUrl}
                    type="box-button"
                  />
                )}
                {platform.os.family.match(/Linux/i) && (
                  <DownloadButton
                    name="Linux"
                    disabled={false}
                    url={linuxUrl}
                    type="box-button"
                  />
                )}
              </>
            )}
            {/* If the OS doesn't match any of the three, display all the buttons */}
            <DownloadAll />
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

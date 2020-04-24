import React from "react";
import { IParticlesParams } from "react-particles-js";
import dynamic from "next/dynamic";
import Icon from "@mdi/react";
import { mdiApple, mdiGithub, mdiLinux, mdiMicrosoftWindows } from "@mdi/js";

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

export default () => {
  return (
    <div className="wrapper">
      <Particles className={"particles"} params={params} />

      <div className="banner">
        <div className="top-section">
          <div>
            <img className="logo" src="/logo.svg" alt="" />

            <span>A torrent client to download, stream and cast torrents.</span>

            <div className="downloads">
              <div className="download-button">
                <Icon path={mdiApple} size={1.5}></Icon>
              </div>
              <div className="download-button">
                <Icon path={mdiMicrosoftWindows} size={1.5}></Icon>
              </div>
              <div className="download-button">
                <Icon path={mdiLinux} size={1.5}></Icon>
              </div>
              <div className="download-button">
                <Icon path={mdiGithub} size={1.5}></Icon>
              </div>
            </div>
          </div>
        </div>
        <div className="demo-wrapper">
          <div className="demo" />
        </div>
      </div>

      <footer>
        Made by &nbsp; <a href="https://twitter.com/ritz078">@ritz078</a>
      </footer>
    </div>
  );
};

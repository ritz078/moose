import Plyr from "plyr";
import React, { useEffect, useRef } from "react";

interface IProps {
  url: string;
  name: string;
  caption: string;
}

export const Player: React.FC<IProps> = ({ url, name, caption }) => {
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const player = new Plyr(playerRef.current);
    return player.destroy;
  }, []);

  return (
    <video title={name} ref={playerRef} controls playsInline>
      <source src={url} />
      <track
        kind="captions"
        label="English captions"
        src={caption}
        srcLang="en"
        default
      />
    </video>
  );
};

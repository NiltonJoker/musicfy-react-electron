import React, { useState, useEffect } from "react";
import { Grid, Progress, Icon, Input, Image } from "semantic-ui-react";
import ReactPlayer from "react-player";

import "./Player.scss";

export default function Player(props) {
  const { songData } = props;
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (songData?.url) {
      onStart();
    }
  }, [songData]);

  const onStart = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onProgress = (data) => {
    setPlayedSeconds(data.playedSeconds);
    setTotalSeconds(data.loadedSeconds);
  };

  return (
    <div className="player">
      <Grid>
        <Grid.Column width={4} className="left">
          {songData && <Image src={songData?.image} />}
          {songData?.name}
        </Grid.Column>
        <Grid.Column width={8} className="center">
          <div className="controls">
            {playing ? (
              <Icon name="pause circle outline" onClick={onPause} />
            ) : (
              <Icon name="play circle outline" onClick={onStart} />
            )}
            <Icon
              name="repeat"
              className={loop ? "repeat active" : "repeat"}
              onClick={() => setLoop(!loop)}
            />
          </div>
          <Progress
            progress="value"
            value={playedSeconds}
            total={totalSeconds}
            size="tiny"
          />
        </Grid.Column>
        <Grid.Column width={4} className="right">
          <Input
            type="range"
            label={
              muted ? (
                <Icon name="volume off" onClick={() => setMuted(!muted)} />
              ) : (
                <Icon name="volume up" onClick={() => setMuted(!muted)} />
              )
            }
            min={0}
            step={0.01}
            max={1}
            name="volume"
            onChange={(e, data) => setVolume(data.value)}
            value={volume}
          />
        </Grid.Column>
      </Grid>
      <ReactPlayer
        className="react-player"
        url={songData?.url}
        playing={playing}
        loop={loop}
        height="0"
        width="0"
        muted={muted}
        volume={parseFloat(volume)}
        onProgress={(e) => onProgress(e)}
      />
    </div>
  );
}

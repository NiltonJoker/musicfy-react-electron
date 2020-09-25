import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { map, size } from "lodash";
import { Link } from "react-router-dom";
import { Icon, Grid } from "semantic-ui-react";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";
import "./SongsSlider.scss";

const db = firebase.firestore(firebase);

export default function SongsSlider({ title, data, playerSong }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    className: "songs-slider__list",
  };

  if (size(data) === 0) {
    return null;
  }

  if (size(data) < 5) {
    return (
      <div className="songs-slider">
        <h2>{title}</h2>
        <Grid>
          {map(data, (item) => (
            <Grid.Column key={item.id} mobile={8} tablet={4} computer={3}>
              <Song item={item} playerSong={playerSong} />
            </Grid.Column>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className="songs-slider">
      <h2>{title}</h2>
      <Slider {...settings}>
        {map(data, (item) => (
          <Song key={item.id} item={item} playerSong={playerSong} />
        ))}
      </Slider>
    </div>
  );
}

function Song({ item, playerSong }) {
  const [album, setAlbum] = useState(null);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    db.collection("albums")
      .doc(item?.album)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = response.id;
        setAlbum(data);
        getImage(data);
      });
  }, [item]);

  const getImage = (data) => {
    firebase
      .storage()
      .ref(`/album/${data.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBanner(url);
      });
  };

  const onPlay = () => {
    playerSong(banner, item.name, item.fileName);
  };

  return (
    <div className="songs-slider__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url('${banner}')` }}
        onClick={onPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={`/album/${album?.id}`}>
        <h3>{item.name}</h3>
      </Link>
    </div>
  );
}

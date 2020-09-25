import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import { map } from "lodash";
import ListSongs from "../../components/Songs/ListSongs";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";
import "./Album.scss";

const db = firebase.firestore(firebase);

const Album = (props) => {
  const { match, playerSong } = props;

  const [album, setAlbum] = useState(null);
  const [albumImage, setAlbumImage] = useState(null);
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .doc(match?.params?.id)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = response.id;
        setAlbum(data);
      });
  }, [match]);

  useEffect(() => {
    if (album) {
      firebase
        .storage()
        .ref(`/album/${album?.banner}`)
        .getDownloadURL()
        .then((url) => {
          setAlbumImage(url);
        });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      db.collection("artists")
        .doc(album?.artist)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setArtist(data);
        });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      db.collection("songs")
        .where("album", "==", album?.id)
        .get()
        .then((response) => {
          const arraySongs = [];
          map(response.docs, (song) => {
            const data = song.data();
            data.id = song.id;
            arraySongs.push(data);
          });
          setSongs(arraySongs);
        });
    }
  }, [album]);

  if (!album || !artist) {
    return <Loader active>Cargando...</Loader>;
  }

  return (
    <div className="album">
      <div className="album__header">
        <HeaderAlbum album={album} albumImage={albumImage} artist={artist} />
      </div>
      <div className="album__songs">
        <ListSongs
          songs={songs}
          albumImage={albumImage}
          albumName={album.name}
          playerSong={playerSong}
        />
      </div>
    </div>
  );
};

export default withRouter(Album);

function HeaderAlbum(props) {
  const { album, albumImage, artist } = props;

  return (
    <>
      <div
        className="image"
        style={{ backgroundImage: `url('${albumImage}')` }}
      />
      <div className="info">
        <h1>{album.name}</h1>
        <p>
          De{" "}
          <Link to={`/artist/${artist.id}`}>
            <span>{artist.name}</span>
          </Link>
        </p>
      </div>
    </>
  );
}

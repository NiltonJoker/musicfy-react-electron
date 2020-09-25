import React from "react";
import { Table, Icon } from "semantic-ui-react";
import { map } from "lodash";
import "./ListSongs.scss";

export default function ListSongs({
  songs,
  albumImage,
  albumName,
  playerSong,
}) {
  if (songs.length === 0) {
    return null;
  }

  return (
    <Table inverted className="list-songs">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          <Table.HeaderCell>Título</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {map(songs, (song) => (
          <Song
            key={song.id}
            song={song}
            albumImage={albumImage}
            playerSong={playerSong}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

function Song({ song, albumImage, playerSong }) {
  const onPlay = () => {
    playerSong(albumImage, song.name, song.fileName);
  };

  return (
    <Table.Row onClick={onPlay}>
      <Table.Cell collapsing>
        <Icon name="play circle outline" />
      </Table.Cell>
      <Table.Cell>{song.name}</Table.Cell>
    </Table.Row>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import firebase from "../../../utils/Firebase";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { map } from "lodash";
import "firebase/firestore";
import "firebase/storage";
import "./AddSongForm.scss";

const db = firebase.firestore(firebase);

export default function AddSongForm({ setShowModal }) {
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState(initialValueForm());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((response) => {
        const arrayAlbums = [];
        map(response?.docs, (album) => {
          const data = album.data();
          const options = {
            key: album.id,
            value: album.id,
            text: data.name,
          };
          arrayAlbums.push(options);
        });
        setAlbums(arrayAlbums);
      });
  }, []);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const uploadSong = (fileName) => {
    const ref = firebase.storage().ref().child(`/song/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.album) {
      toast.warning(
        "El nombre de la canción y el album al que pertener son obligatorios"
      );
    } else if (!file) {
      toast.warning("La canción es obligatoria");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadSong(fileName)
        .then(() => {
          db.collection("songs")
            .add({
              name: formData.name,
              album: formData.album,
              fileName: fileName,
            })
            .then(() => {
              toast.success("Canción subida correctamente.");
              setIsLoading(false);
              resetForm();
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Error al subir la canción.");
              setIsLoading(false);
            });
        })
        .catch(() => {
          toast.error("Error al subir la canción");
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setAlbums([]);
  };

  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Nombre de la canción"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Asigna la canción a un album"
          fluid
          search
          selection
          lazyLoad
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />
          <div>
            <p>
              Arrastra tu canción o haz click <span>aquí</span>.
            </p>
            {file && (
              <p>
                Canción subida: <span>{file?.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Subir Canción
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
    album: "",
  };
}

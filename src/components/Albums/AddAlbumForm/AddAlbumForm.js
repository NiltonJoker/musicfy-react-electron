import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { map } from "lodash";
import firebase from "../../../utils/Firebase";
import { v4 as uuidv4 } from "uuid";
import "firebase/firestore";
import "firebase/storage";
import NoImage from "../../../assets/png/no-image.png";
import "./AddAlbumForm.scss";


const db = firebase.firestore(firebase);

export default function AddAlbumForm({ setShowModal }) {
  const [albumImage, setAlbumImage] = useState(null);
  const [file, setFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [formData, setFormData] = useState(initialValueForm());
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const url = URL.createObjectURL(file);
    setFile(file);
    setAlbumImage(url);
  }, []);

  const { getInputProps, getRootProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((response) => {
        const arrayArtists = [];
        map(response.docs, (artist) => {
          const data = artist.data();
          arrayArtists.push({
            key: artist.id,
            value: artist.id,
            text: data.name,
          });
        });
        setArtists(arrayArtists);
      });
  }, []);

  const uploadImage = (fileName) => {
    const ref = firebase.storage().ref().child(`/album/${fileName}`);
    return ref.put(file);
  };

  const resetForm = () => {
    setFormData(initialValueForm())
    setFile(null)
    setAlbumImage(null)
  }
  

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.artist) {
      toast.warning("El nombre del albúm y es artista son obligatorios");
    } else if (!file) {
      toast.warning("La imagen del albúm es obligatoria");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadImage(fileName).then(() => {
        const album = { ...formData, banner: fileName };
        db.collection("albums")
          .add(album)
          .then(() => {
            toast.success("Albúm creado")
            resetForm()
            setIsLoading(false)
            setShowModal(false)
          }).catch(() => {
            toast.warning("Error al crear el albúm")
            setIsLoading(false)
          })
      }).catch(() => {
        toast.warning("Error al subir la imagen del albúm")
        setIsLoading(false)
      })
    }
  };

  return (
    <Form className="add-album-form" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar" width={5}>
          <div
            {...getRootProps()}
            style={{ backgroundImage: `url('${albumImage}')` }}
            className="avatar"
          />
          <input {...getInputProps()} />
          {!albumImage && <Image src={NoImage} />}
        </Form.Field>
        <Form.Field className="album-inputs">
          <Input
            placeholder="Nombre del albúm"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Dropdown
            placeholder="El albúm pertenece..."
            fluid
            search
            selection
            lazyLoad
            options={artists}
            onChange={(e, data) =>
              setFormData({ ...formData, artist: data.value })
            }
          />
        </Form.Field>
      </Form.Group>
      <Button type="submit" loading={isLoading}>
        Crear Albúm
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
    artist: "",
  };
}

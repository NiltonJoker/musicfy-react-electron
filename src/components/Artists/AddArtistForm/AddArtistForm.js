import React, { useCallback, useState } from "react";
import { Form, Input, Button, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../../utils/Firebase";
import "firebase/storage";
import "firebase/firestore";
import NoImage from "../../../assets/png/no-image.png";

import "./AddArtistForm.scss";

const db = firebase.firestore(firebase);

export default function AddArtistForm({ setShowModal }) {
  const [banner, setBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState(initialValueForm());
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setFile(file);
    setBanner(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (fileName) => {
    const ref = firebase.storage().ref().child(`artist/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.warning("Añade el nombre del Artista");
    } else if (!file) {
      toast.warning("Añade la imagen del Artista");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadImage(fileName)
        .then(() => {
          db.collection("artists")
            .add({ name: formData.name, banner: fileName })
            .then(() => {
              toast.success("Artista creado correctamente.");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Error al crear el Artista");
              setIsLoading(false);
            });
        })
        .catch(() => {
          toast.error("Error al subir la imagen.");
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setBanner(null);
  };

  return (
    <Form className="add-artist-form" onSubmit={onSubmit}>
      <Form.Field className="artist-banner">
        <div
          {...getRootProps()}
          className="banner"
          style={{ backgroundImage: `url('${banner}')` }}
        />
        <input {...getInputProps()} />
        {!banner && <Image src={NoImage} />}
      </Form.Field>
      <Form.Field className="artist-avatar">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${banner ? banner : NoImage}')` }}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Nombre del artista"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Crear Artista
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
  };
}

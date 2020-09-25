import React, { useState } from "react";
import { Form, Input, Icon, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserEmail({
  user,
  setShowModal,
  setTitleModal,
  setContentModal,
}) {
  const onEdit = () => {
    setTitleModal("Actualizar Email");
    setContentModal(
      <ChangeEmailForm email={user.email} setShowModal={setShowModal} />
    );
    setShowModal(true);
  };

  return (
    <div className="user-email">
      <h3>Email: {user.email}</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangeEmailForm({ email, setShowModal }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.warning("El email es el mismo");
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updateEmail(formData.email)
            .then(() => {
              toast.success("Email Actualizado.");
              setIsLoading(false);
              setShowModal(false);
              currentUser
                .sendEmailVerification()
                .then(() => firebase.auth().signOut());
            })
            .catch((err) => {
              console.log(err);
              alertErrors(err?.code);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          // El interrogante en este caso significa que solo se pasara err si existe
          alertErrors(err?.code);
          setIsLoading(false);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={email}
          type="text"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          icon={
            showPassword ? (
              <Icon
                name="eye slash outline"
                link
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <Icon
                name="eye"
                link
                onClick={() => setShowPassword(!showPassword)}
              />
            )
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar Email
      </Button>
    </Form>
  );
}

import React, { useState } from "react";
import { Form, Button, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserPassword({
  setShowModal,
  setTitleModal,
  setContentModal,
}) {
  const onEdit = () => {
    setTitleModal("Actualizar Contraseña");
    setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
    setShowModal(true);
  };

  return (
    <div className="user-password">
      <h3>Contraseña: *** *** *** ***</h3>
      <Button circular onClick={onEdit}>
        Actualizar
      </Button>
    </div>
  );
}

function ChangePasswordForm({ setShowModal }) {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    repeatNewPassword: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      toast.warning("La contraseñas no pueden estar vacias");
    } else if (formData.currentPassword === formData.newPassword) {
      toast.warning("La nueva contraseña no puede ser a la actual");
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      toast.warning("Las nuevas contraseñas no coinciden");
    } else if (formData.newPassword.length < 6) {
      toast.warning("La contraseña tiene que tener minimo 6 caracteres");
    } else {
      setIsLoading(true);
      reauthenticate(formData.currentPassword)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updatePassword(formData.newPassword)
            .then(() => {
              toast.success("Contraseña Actualizada")
              setIsLoading(false)
              setShowModal(false)
              firebase.auth().signOut()
            })
            .catch((err) => {
              alertErrors(err?.code);
              setIsLoading(false)
            });
        })
        .catch((err) => {
          alertErrors(err?.code);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          type={showPassword.currentPassword ? "text" : "password"}
          placeholder="Contraseña Actual"
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
          icon={
            <Icon
              name={showPassword.currentPassword ? "eye slash outline" : "eye"}
              link
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  currentPassword: !showPassword.currentPassword,
                })
              }
            />
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          type={showPassword.newPassword ? "text" : "password"}
          placeholder="Nueva Contraseña"
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
          icon={
            <Icon
              name={showPassword.newPassword ? "eye slash outline" : "eye"}
              link
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  newPassword: !showPassword.newPassword,
                })
              }
            />
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          type={showPassword.repeatNewPassword ? "text" : "password"}
          placeholder="Repetir Nueva Contraseña"
          onChange={(e) =>
            setFormData({ ...formData, repeatNewPassword: e.target.value })
          }
          icon={
            <Icon
              name={
                showPassword.repeatNewPassword ? "eye slash outline" : "eye"
              }
              link
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  repeatNewPassword: !showPassword.repeatNewPassword,
                })
              }
            />
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Actualizar Contraseña
      </Button>
    </Form>
  );
}

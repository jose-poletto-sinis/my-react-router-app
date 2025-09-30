import { Form, useActionData, useNavigation, useParams, useNavigate } from "react-router";
import React, { type ReactNode } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";


export async function action({ params }: { params: { id: string } }) {
  const response = await fetch(
    `https://appcms.desarrollo.dnscheck.com.ar/Atributos/DeleteAtributo/IdAtributo/${params.id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    return { error: "Error al borrar el atributo: " + response.status };
  }

  return { resultado: "Atributo borrado correctamente" };
}

export default function DeleteAtributo() {
  const { id, nombre } = useParams<{ id: string; nombre: string }>();
  const actionData = useActionData() as {
      nombre: ReactNode; error?: string; resultado?: string 
};
  const navigation = useNavigation();
  const navigate = useNavigate();

  const isDeleting = navigation.state === "submitting";

  const close = () => navigate(-1); // vuelve a la URL anterior


  React.useEffect(() => {
    if (actionData?.resultado) {
      navigate(-1);
    }
  }, [actionData, navigate]);

  return (
    <Dialog title={"Confirmar eliminación"} onClose={close}>
      <p style={{ margin: "20px", textAlign: "center" }}>
        ¿Seguro que quieres eliminar el atributo <strong>{nombre}</strong> con ID {" "}
        <strong style={{ color: "red" }}>{id}</strong>?
      </p>

      <Form method="delete">
        <DialogActionsBar>
          <Button
            themeColor="secondary"
            type="button"
            onClick={close}
          >
            Cancelar
          </Button>
          <Button
            themeColor="error"
            type="submit"
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActionsBar>
      </Form>

      {actionData?.resultado && (
        <p style={{ color: "green", marginTop: "1rem" }}>{actionData.resultado}</p>
      )}
      {actionData?.error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{actionData.error}</p>
      )}
    </Dialog>
  );
}

import { Form, useActionData, useLoaderData, useNavigate, useParams, useOutletContext } from "react-router";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import "@progress/kendo-theme-default/dist/all.css";
import React, { useState, useEffect } from "react";

// 🔹 Loader: trae las unidades de medida
export async function loader() {
  const res = await fetch(
    "https://appcms.desarrollo.dnscheck.com.ar/UnidadesMedida/GetUnidadesMedida"
  );
  if (!res.ok) throw new Error("No se pudieron cargar las unidades de medida");
  return res.json();
}

// 🔹 Action para editar el atributo
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const idAtributo = formData.get("idAtributo");
  const nombre = formData.get("nombre");
  const nombreCorto = formData.get("nombreCorto");
  const tipoValor = formData.get("tipoValor");
  const valorMinimo = formData.get("valorMinimo");
  const valorMaximo = formData.get("valorMaximo");
  const valoresPosibles = formData.getAll("valoresPosibles");
  const comentario = formData.get("comentario");
  const activo = true;

  const body = {
    idAtributo: Number(idAtributo),
    nombre,
    nombreCorto,
    tipoValor,
    valorMinimo,
    valorMaximo,
    valoresPosibles,
    strUniMeds: [],
    comentario,
    activo,
  };

  const response = await fetch(
    "https://appcms.desarrollo.dnscheck.com.ar/Atributos/ActualizarAtributo",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return { error: "Error al editar el atributo: " + response.status };
  }
  return { resultado: "Atributo editado correctamente" };
}

// 🔹 Componente
export default function EditarAtributo() {
  const [nombre, setNombre] = useState("");
  const [nombreCorto, setNombreCorto] = useState("");
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [nombreCortoError, setNombreCortoError] = useState("");
  const { idAtributo } = useParams<{ idAtributo: string }>();
  const actionData = useActionData() as { error?: string; resultado?: string };
  const unidades = useLoaderData() as { idUnidad: number; nombre: string }[];
  const navigate = useNavigate();
  // Consumir outlet context correctamente
  const { selectedItem } = useOutletContext<{ selectedItem: any }>();

  const [valoresPosibles, setValoresPosibles] = useState<string[]>([""]);

  useEffect(() => {
    if (selectedItem) {
      setNombre(selectedItem.nombre || "");
      setNombreCorto(selectedItem.nombreCorto || "");
      setValorMinimo(selectedItem.valorMinimo || "");
      setValorMaximo(selectedItem.valorMaximo || "");
      if (selectedItem.valoresPosibles) setValoresPosibles(selectedItem.valoresPosibles);
    }
  }, [selectedItem]);

  const handleValoresChange = (idx: number, value: string) => {
    const nuevos = [...valoresPosibles];
    nuevos[idx] = value;
    setValoresPosibles(nuevos);
  };

  const agregarValor = () => setValoresPosibles([...valoresPosibles, ""]);
  const quitarValor = (idx: number) =>
    setValoresPosibles(valoresPosibles.filter((_, i) => i !== idx));

  useEffect(() => {
    if (actionData?.resultado) navigate(-1);
  }, [actionData, navigate]);

  return (
    <Dialog title="Editar atributo" onClose={() => navigate(-1)}>
      <Form method="post">
        <input type="hidden" name="idAtributo" value={idAtributo} />
        <div className="k-form-field">
          <label>Nombre:</label>
          <input
            className="k-textbox"
            name="nombre"
            required
            value={nombre}
            onChange={e => {
              setNombre(e.target.value);
              if (e.target.value === nombreCorto) {
                setNombreCortoError("El nombre corto no puede ser igual al nombre");
              } else {
                setNombreCortoError("");
              }
            }}
          />
        </div>
        <div className="k-form-field">
          <label>Nombre corto:</label>
          <input
            className="k-textbox"
            name="nombreCorto"
            required
            value={nombreCorto}
            onChange={e => {
              setNombreCorto(e.target.value);
              if (e.target.value === nombre) {
                setNombreCortoError("El nombre corto no puede ser igual al nombre");
              } else {
                setNombreCortoError("");
              }
            }}
          />
          {nombreCortoError && (
            <p style={{ color: "red", margin: 0 }}>{nombreCortoError}</p>
          )}
        </div>
        <div className="k-form-field">
          <label>Tipo de valor:</label>
          <div style={{ display: "flex", gap: 16 }}>
            <label>
              <input type="radio" name="tipoValor" value="Numerico" required /> Numerico
            </label>
            <label>
              <input type="radio" name="tipoValor" value="Unidad" required /> Unidad
            </label>
          </div>
        </div>
        <div className="k-form-field">
          <label>Valor mínimo:</label>
          <input
            className="k-textbox"
            name="valorMinimo"
            required
            value={valorMinimo}
            onChange={e => setValorMinimo(e.target.value)}
          />
        </div>
        <div className="k-form-field">
          <label>Valor máximo:</label>
          <input
            className="k-textbox"
            name="valorMaximo"
            required
            value={valorMaximo}
            onChange={e => setValorMaximo(e.target.value)}
          />
        </div>

        {/* 🔹 ComboBox dinámico para valores posibles */}
        <div className="k-form-field">
          <label>Valores posibles:</label>
          {valoresPosibles.map((valor, idx) => (
            <div key={idx} style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <ComboBox
                data={unidades.map(u => u.nombre)}
                name="valoresPosibles"
                value={valor}
                onChange={(e) => handleValoresChange(idx, e.value as string)}
                required
              />
              {valoresPosibles.length > 1 && (
                <Button
                  type="button"
                  onClick={() => quitarValor(idx)}
                  themeColor="base"
                >
                  -
                </Button>
              )}
            
            </div>
          ))}
        </div>

        <input type="hidden" name="strUniMeds" value="" />
        <div className="k-form-field">
          <label>Comentario:</label>
          <input className="k-textbox" name="comentario"  />
        </div>
        <input type="hidden" name="activo" value="true" />

        <DialogActionsBar>
          <Button
            type="button"
            themeColor="secondary"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button type="submit" themeColor="primary" disabled={!!nombreCortoError}>
            Guardar cambios
          </Button>
        </DialogActionsBar>

        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        {actionData?.resultado && (
          <p style={{ color: "green" }}>{actionData.resultado}</p>
        )}
      </Form>
    </Dialog>
  );
}

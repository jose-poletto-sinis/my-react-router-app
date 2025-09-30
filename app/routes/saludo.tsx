import { Grid, GridColumn } from "@progress/kendo-react-grid";
import type { GridCellProps } from "@progress/kendo-react-grid";

export const loader = async () => {
  const response = await fetch(
    "https://appcms.desarrollo.dnscheck.com.ar/Atributos/GetAtributos"
  );
  if (!response.ok) throw new Error("Error al obtener los datos");
  const data = await response.json();
  return { atributos: data };
};
;


import { Outlet, useLoaderData, useNavigate } from "react-router";
import { useState } from "react";


const ActionCell = (props: GridCellProps & { onEdit: (item: any) => void }) => {
  const navigate = useNavigate();
  return (
    <td>
      <button
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "4px 8px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => navigate(`borrar/${props.dataItem.nombre}/${props.dataItem.idAtributo}`)}
      >
        Borrar
      </button>
      <button
        style={{
          background: "green",
          color: "white",
          border: "none",
          padding: "4px 8px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => {
          props.onEdit(props.dataItem);
          navigate(`editar/${props.dataItem.idAtributo}`);
        }}
      >
        Editar
      </button>
    </td>
  );
};

export default function Saludo() {
  const { atributos } = useLoaderData() as { atributos: any[] };
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const navigate = useNavigate();
  return (
    <div>
      <Grid
        data={atributos}
        style={{ height: "500px" }}
      >
        <GridColumn field="idAtributo" title="ID" width="80px" />
        <GridColumn field="nombre" title="Nombre" />
        <GridColumn field="nombreCorto" title="Nombre Corto" />
        <GridColumn field="tipoValor" title="Tipo de Valor" />
        <GridColumn field="valorMinimo" title="Valor Mínimo" />
        <GridColumn field="valorMaximo" title="Valor Máximo" />
        <GridColumn
          title="Acciones"
          width="120px"
          cells={{ data: (props: GridCellProps) => <ActionCell {...props} onEdit={setSelectedItem} /> }}
        />
      </Grid>
      {/* Botón Crear */}
      <button
        style={{ marginTop: 16, background: "#1976d2", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
        onClick={() => navigate('crear')}
      >
        Crear atributo
      </button>
      {/* Outlet para el dialog, pasando el contexto */}
      <Outlet context={{ selectedItem }} />
    </div>
  );
}

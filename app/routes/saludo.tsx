import { Outlet, useLoaderData, useNavigate } from "react-router";
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

// 🔹 Celda con botón Delete
const ActionCell = (props: GridCellProps) => {
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
    </td>
  );
};

export default function Saludo() {
  const { atributos } = useLoaderData() as { atributos: any[] };

  return (
    <div>
      <Grid data={atributos} style={{ height: "500px" }}>
        <GridColumn field="idAtributo" title="ID" width="80px" />
        <GridColumn field="nombre" title="Nombre" />
        <GridColumn field="nombreCorto" title="Nombre Corto" />
        <GridColumn field="tipoValor" title="Tipo de Valor" />
        <GridColumn title="Acciones" width="120px" cells={{ data: ActionCell }} />
      </Grid>

      {/* 🔹 Aquí se inyecta el Dialog cuando visites /saludo/borrar/:id */}
      <Outlet />
    </div>
  );
}

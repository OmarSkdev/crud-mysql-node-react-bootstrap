import './App.css';
import { useEffect, useState } from "react";
import Axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const noti = withReactContent(Swal)



function App() {

  const [nombre,setNombre] = useState("");
  const [edad,setEdad] = useState(0);
  const [pais,setPais] = useState("");
  const [cargo,setCargo] = useState("");
  const [anios,setAnios] = useState(0);
  const [id,setId] = useState();

  const [empleadosList, setEmpleados] = useState([]);
  const [editar, setEditar] = useState(false);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      anios:anios
    }).then(()=>{
      getEmpleados();
      //alert("Empleado registrado");
      limpiarDatos();
      noti.fire({
        title:<strong>Empleado agregado</strong>,
        html:<i>El empleado {nombre} fue registrado</i>,
        icon:'success'
      })
    });    
  }

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id:id,
      nombre:nombre,
      edad:edad,
      pais:pais,
      cargo:cargo,
      anios:anios
    }).then(()=>{
      getEmpleados();
      //alert("Actualizado!!");
      limpiarDatos();
      noti.fire({
        title:<strong>Empleado agregado</strong>,
        html:<i>El empleado <strong>{nombre}</strong> fue actualizado</i>,
        icon:'success',
        timer:3000
      })
    });    
  }

  const deleteEmp = (value) => {

    noti.fire({
      title:<strong>Eliminar</strong>,
      html:`<i>Desea eliminar <strong>${value.nombre}</strong> de la lista?</i>`,
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          Axios.delete(`http://localhost:3001/delete/${value.id}`, {
      
          }).then(()=>{
            getEmpleados();
            //alert("Actualizado!!");
            limpiarDatos();
            
          });   
          noti.fire(
            'Eliminado!',
             value.nombre+" fue eliminado",
            "success",
            3000
          )
      }        
    });
     
  }

  const limpiarDatos = () => {
    setId("");
    setNombre("");
    setCargo("");
    setEdad("");
    setPais("");
    setAnios("");
    setEditar(false);
  }
  



  const editarEmpleado = (val) => {
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setCargo(val.cargo);
    setPais(val.pais);
    setAnios(val.anios);
    setId(val.id);
  }

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response)=>{    
      setEmpleados(response.data);
      //alert("hola");
    });
  }

  useEffect(()=>{
    getEmpleados();
  },[]);

  

  return (
    <div className='container'>
    
      <div className="card text-center">
        <div className="card-header">
          GESTIÓN DE EMPLEADOS
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input type="text"
              onChange={(event)=>{setNombre(event.target.value)}}
              className="form-control" value={nombre} placeholder="Ingrese un Nombre" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input type="number"
              onChange={(event)=>{setEdad(event.target.value)}}
              className="form-control" value={edad} placeholder="Ingrese Edad" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>  

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">País:</span>
            <input type="text" value={pais}
              onChange={(event)=>{setPais(event.target.value)}}
              className="form-control" placeholder="Ingrese País" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>  

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input type="text" value={cargo}
              onChange={(event)=>{setCargo(event.target.value)}}
              className="form-control" placeholder="Ingrese Cargo" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años de Experiencia:</span>
            <input type="number" value={anios}
              onChange={(event)=>{setAnios(event.target.value)}}
              className="form-control" placeholder="Ingrese Años de experiencia" aria-label="Username" aria-describedby="basic-addon1"/>
          </div>         
        
        </div>
        <div className="card-footer text-muted">
          {
            editar?
            <div>
              <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
              <button className='btn btn-info m-2' onClick={limpiarDatos}>Cancelar</button>
            </div>
            :<button className='btn btn-success' onClick={add}>Registrar</button>
          }
          
        </div>
      </div>
      <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">País</th>
              <th scope="col">Cargo</th>
              <th scope="col">Experiencia</th>
              <th scope="col">Acciones</th>

            </tr>
          </thead>
          <tbody>
          {
            empleadosList.map((value,key)=>{
              return <tr key={value.id}>
                  <th>{value.id}</th>
                  <td>{value.nombre}</td>
                  <td>{value.edad}</td>
                  <td>{value.pais}</td>
                  <td>{value.cargo}</td>
                  <td>{value.anios}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button"
                        onClick={(event)=>{
                          editarEmpleado(value);
                        }} 
                       className="btn btn-info">Editar</button>
                      <button type="button" onClick={()=>{
                        deleteEmp(value)
                      }} className="btn btn-danger">Eliminar</button>
                      
                    </div>
                  </td>
              </tr>       
            })
          }

           
          
          </tbody>
      </table>
    </div>
  );
}

export default App;

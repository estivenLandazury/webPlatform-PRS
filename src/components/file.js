import React, { Component } from 'react';
import logop from '../images/logo.png';
import fondo from '../images/descarga.svg';
import QRCode from 'react.qrcode.generator';
import { Link } from 'react-router-dom';
import { UncontrolledCarousel,Modal,ModalBody, ModalFooter, ModalHeader, Alert,Button } from "reactstrap";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { Spinner } from 'reactstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Graphic from './graphics';

import { Document, Page } from 'react-pdf';



var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;



class File extends Component {


    constructor(props) {
        {/* Este método es el primero que se ejecuta antes del render*/ }

        {/* Con el método super heredo todas la funcionalidades de react*/ }
        super(props);

        {/* State me indica el estado en el que están los datos en la aplicación react
    especificamente en este componente*/}
        this.state = {
            contenido: "",
            fileName: "",
            modalIsopen: false,
            prueba: "hola bb",
            URL: "http://34.238.51.175:5000/",
            URL1: 'https://0gqxxhb0wb.execute-api.us-east-1.amazonaws.com/Prod/send/',
            file: null,
            loader: false,
            company: "",
            email: "",
            descripcion: "",
            showDetails:false,
            details:{'porCeldasVacias':0,'porFilasVacias':0,'numCeldasVacias':0,'numColVacias':0
            ,'numDatosCorr':0,'numDatosMixtos':0,'numFilasRepetidas':0,'texto':[ ],
            numPages: null,
            pageNumber: 1,
            open:false,}


        }

        this.serviceKey = props.serviceKey;
        this.token = props.token;

        this.sendFile= this.sendFile.bind(this);

        console.log("hola" + this.props)
    }


    /*  Funciones el modal */ 
openDetails = () => {
    this.setState({ showDetails: true });
};
  onOpenModal = () => {
    this.setState({ open: true });
  };
 
  onCloseModal = () => {
    this.setState({ open: false });
  };


  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

    toggleModal = value => {
        this.setState({
            modalIsopen: !this.state.modalIsopen
        });


    }


    onChange(e) {

        let files = e.target.files;
        console.log(files[0])

        this.setState({
            file: files[0]

        })





    }

    input1(e) {
        this.setState({
            company: e.target.value
        })
        console.log(e.target.value)

    }

    input2(e) {
        this.setState({
            email: e.target.value
        })
        console.log(e.target.value)

    }
    input3(e) {
        this.setState({
            descripcion: e.target.value
        })
        console.log(e.target.value)

    }


    loaderFile() {



        /*this.sendFile()
*/

        if (this.state.file !== null && this.state.email !== "" && this.state.company !== "" && this.state.descripcion !== "") {

            this.setState({
                loader: true
            })

            var promise = Promise.resolve(this.sendFile())
            const that = this


            promise.then(function () {
                if (that.state.loader == true) {
                    console.log("Hola pachito " + that.state.loader)


                    setTimeout(() => {

                        document.getElementById("fileinput").value = "";
                        document.getElementById("inputCompany").value = "";
                        document.getElementById("inputEmail3").value = "";
                        document.getElementById("exampleFormControlTextarea1").value = "";
                        NotificationManager.success("Success message", "The information was sent successfully", 5000)

                        that.setState({
                            loader: false
                        })

                    }, 2000)


                }

            })
        } else {
            NotificationManager.warning("Warning message", "Fill in all the information before sending it")

        }



    }


    sendFile(ev) {
        console.log("ddddddd")

        let file =this.state.file

        if(file!==null && this.state.email === ""&& this.state.company === "" && this.state.descripcion ===""){
            NotificationManager.warning('Warning  message', 'Ingrese los campos correspondientes', 5000)


        }

        if(file===null && this.state.email !== ""&& this.state.company !== "" && this.state.descripcion !==""){
            NotificationManager.warning('Warning  message', 'Cargue el archivo a enviar', 5000)


        }

        if(file!==null && this.state.email !== ""&& this.state.company!== "" && this.state.descripcion !==""){

            this.sendEmail()

            

        


        ev.preventDefault();
        const data = new FormData();
        

        data.append('file', file);
        console.log("si llegue al send")
        this.setState({loader:true})
        fetch(this.state.URL+'enviar', {
            method: 'POST',
            body: data,
            headers:{
                'Access-Control-Allow-Origin': '*'
              }
          }).then((response) => response.json())
          .then((responseJson) => {
              


           
            if(responseJson.Estado=='No Excel')
            {
                this.setState({loader:false})
                NotificationManager.success('Success message', 'Archivo enviado con éxito');
            }else
            {

                    this.setState({loader:false},this.setState({open:true}))
                    NotificationManager.success('Success message', 'Archivo enviado con éxito');
                    let convert = parseFloat(responseJson.porFilasVacias)*100;
                    let porceldas=parseFloat(responseJson.porCeldasVacias)
                    this.setState({details:{'porCeldasVacias':porceldas,'porFilasVacias':convert,'numCeldasVacias':responseJson.numCeldasVacias,'numColVacias':responseJson.numColVacias,
                    'numDatosCorr':responseJson.numDatosCorr,'numDatosMixtos':responseJson.numDatosMixtos,'numFilasRepetidas':responseJson.numFilasRepetidas,
                    'numFilasVacias':responseJson.numFilasVacias,'texto':responseJson.texto
                }})

            }

        
        }
        
        )
          .catch((error) => {
            NotificationManager.error('Error message', 'Ocurrio un error intente mas tarde')
            this.setState({loader:false})

          });

        }else if (file===null &&  this.state.email === ""&& this.state.company=== "" && this.state.descripcion ===""){
            NotificationManager.warning('Warning  message', 'Elija el  archivo a enviar y llene los campos correspondientes', 5000)


        } 

/*
        let files = this.state.file


        const reader = new FileReader();

        console.log("hola bb" + files[0].name)
        var dato = files[0].name;
        reader.readAsDataURL(files[0]);
        reader.onload = (() => {

            let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');


            let data = { 'contenido': encoded, 'filename': dato }
            let options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            }


            console.log(options)

            fetch(this.state.URL + "enviar", options)
                .then(response => response.json())
                .then((responseJson) => {
                    console.log("este es response " + responseJson.estado)



                }).catch(error => console.log(error))



            console.log(encoded)
            console.log("mira ve" + dato)
        });



        /*toBase64(files[0])*/


/*
                let data1 = {
                    "toEmails": [
                        "cts.prescriptiva@carvajal.com"],
                    "subject": "Update-File",
                    "message": "Subí mi información a u su plataforma deseo que se contacten conmigo, mi email es " + this.state.email + " soy de la empresa" + this.state.company + " y  " + this.state.descripcion + " el nombre del archivo es " + files[0].name
                }
                console.log("+ mira la data" + data1.toEmails)
                let options1 = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data1)
        
                }
                if (data1 !== null && options1 !== null && files !== null) {
        
        
        
                    console.log("ahi vamos")
        
                    fetch('https://0gqxxhb0wb.execute-api.us-east-1.amazonaws.com/Prod/send/', options1)
                        .then(response => response.json())
                        .then((responseJson) => {
                            console.log("este es response " + responseJson.estado)
        
        
        
                        }).catch(error => console.log(error))
        
                }
*/


    }


    sendEmail(){
        let data1 = {
            "toEmails": [
                "cts.prescriptiva@carvajal.com"],
            "subject": "Upload-File",
            "message": "Subí mi información a u su plataforma deseo que se contacten conmigo, mi email es " + this.state.email + " soy de la empresa" + this.state.company + " y  " + this.state.descripcion + " el nombre del archivo es " + this.state.file.name
        }
        console.log("+ mira la data" + data1.toEmails)
        let options1 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data1)

        }



            console.log("ahi vamos")

            fetch('https://0gqxxhb0wb.execute-api.us-east-1.amazonaws.com/Prod/send/', options1)
                .then(response => response.json())
                .then((responseJson) => {
                    console.log("este es response " + responseJson.estado)



                }).catch(error => console.log(error))

        

    }


    componentDidMount() {
        console.log("montado")

    }


   
    render() {

        if(this.state.showDetails==false)
        {
            return (

                <div>

<Document
          file={this.state.file}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page pageNumber={this.state.pageNumber} />
        </Document>
        <p>Page {this.state.pageNumber} of {this.state.numPages}</p>
                    
    
     <NotificationContainer></NotificationContainer>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-custom fixed-top">
                        <img src={logop} className="home-logo" alt="Logo" />
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
    
                        <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                            <ul className="navbar-nav mr-auto">
                            </ul>
    
                            <form className="form-inline my-2 my-lg-0">
                                <a className="btn btn-primary my-2 my-sm-0" href="http://prescriptiva.co/" >Know More</a>
                            </form>
                        </div>
                    </nav>
    
    
                    <div>
    
                        <h2>We transform data into strategies</h2>
                        <img src={fondo} className="fondo" alt="Logo" />
    
                        <form className="rigthform" >
    
                            <div className="form-group row">
                                <label for="inputCompany" className="col-sm-4 col-form-label"><h1>
                                    Company name </h1></label>
                                <div className="col-sm-10">
                                    <input type="text" class="form-control" id="inputCompany" placeholder="Company name" onChange={this.input1.bind(this)} />
                                </div>
                            </div>
    
                            <div className="form-group row">
                                <label for="inputEmail3" class="col-sm-4 col-form-label"><h1> Email </h1></label>
                                <div className="col-sm-10" >
                                    <input type="email" className="form-control" id="inputEmail3" placeholder="Email" onChange={this.input2.bind(this)} />
                                </div>
                            </div>
    
    
    
                            <div className="form-group row">
                                <label for="exampleFormControlTextarea1" className="col-sm-4 col-form-label"><h1> Description </h1></label>
                                <div className="col-sm-10">
                                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="8" onChange={this.input3.bind(this)}></textarea>
                                </div>
                            </div>
    
                            <div className="form-group row">
                                <form className="md-form">
                                    <div className="file-field">
    
                                        <label for="avatar"><h1> Choose a file</h1></label> <br></br>
                                        <div className="btn">
                                            <input ref={(ref) => { this.uploadInput = ref; }} type="file" id="fileinput" name="file_input" multiple="multiple" onChange={(e) => this.onChange(e)} />
                                        </div>
                                    </div>
                                </form>
    
                            </div>
    
                            <div style={{display:"inline"}}></div>
                            <button type="button" className="btn btn-primary mb-2" onClick={this.sendFile.bind(this)}> Send Information</button>
                            {this.state.loader ?(<Spinner  style={{marginLeft:"5%"}}color="primary" />):(<h1 style={{display:'none'}}>"HOLA"</h1>)}
                            
    
                        </form>
    
                    </div>


                    <div>
                        
                            <Modal isOpen={this.state.open}>
                                <ModalHeader >Analisis rapido</ModalHeader>
                                     <ModalBody>
                                         <h3 style={{fontSize:20}}>
                                            El archivo que subio es un .xlsx, se realizo una evaluación rapida de su base de datos ¿Desea ver el analisis?  
                                        </h3>
                                    </ModalBody>
                                <ModalFooter>
                                <Button color="primary" onClick={this.openDetails}>Ver analisis</Button>{' '}
                                <Button color="secondary" onClick={this.onCloseModal}>Cancelar</Button>
                                </ModalFooter>
                            </Modal>
                    </div>
                    {/*this.loader()*/}
    
    
                </div >
            );

        }else
        {       

          
            return (

                <div>
                    
    
    
                    <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-custom fixed-top">
                        <img src={logop} className="home-logo" alt="Logo" />
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
    
                        <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                            <ul className="navbar-nav mr-auto">
                            </ul>
    
                            <form className="form-inline my-2 my-lg-0">
                                <a className="btn btn-primary my-2 my-sm-0" href="http://prescriptiva.co/" >Know More</a>
                            </form>
                        </div>
                    </nav>

                  

                    
                   
 
                    
    
                <Graphic data={this.state.details}></Graphic>
                </div >
            );
        }


    }

}


export default File; 
import React, { Component } from 'react';
import '../css/App.css';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : null,
            dataSource : null
        }

        this.buildDatasource = this.buildDatasource.bind(this);
        this.findposition = this.findposition.bind(this);
    }

    componentDidMount() {
        const data = this.props.Data;

        this.buildDatasource(data);

        this.setState({ data });
    }

    // Build dataSource
    buildDatasource(data) {
        let dataSource = [];

        // ajout des attibuts startTime(conversion de start en minutes), endTime(startTime + duration) dans le dataSource
        data.forEach( (element, index) => {
            // hour * 60 + minutes
            let startTime = (parseInt(element.start.split(":")[0],10) * 60) + (parseInt(element.start.split(":")[1],10));
            let endTime = startTime + element.duration;
            dataSource.push( {id: element.id, startTime: startTime, endTime: endTime, duration: element.duration })
        });

        // Voisins
        dataSource.forEach( element => {
            element.voisins = [];
            dataSource.forEach( value => {
                if( element !== value) {
                    if( element.startTime <= value.startTime && element.endTime > value.startTime) {
                        element.voisins.push(value.id); 
                    } else if(element.startTime >= value.startTime && element.startTime < value.endTime) {
                        element.voisins.push(value.id); 
                    }
                }
            })
        })

        //width : width = 1 => 100% de la largeur; width = 2 => 50% de la largeur; width = 3 => 33% de la largeur
        dataSource.forEach( element => {
            // si l'element a des voisins et pas de width
            if(element.voisins && element.voisins.length && !element.width) {
                // cas avec plus de deux voisins
                if(element.voisins.length >= 2) {
                    // si les deux voisins sont aussi voisins entre eux
                    if( dataSource[element.voisins[0]-1].voisins.includes(element.voisins[1])) {
                        element.width = 3;
                        element.voisins.forEach( voisin => dataSource[voisin-1].width = 3);
                    // sinon
                    } else {
                        element.width = 2;
                        element.voisins.forEach( voisin => dataSource[voisin-1].width = 2);
                    }
                    
                // cas avec 1 voisin
                } else if(element.voisins.length === 1) {
                    if(dataSource[element.voisins[0]-1].width === 3){
                        element.width = 3;
                    } else if(dataSource[element.voisins[0]-1].width === 2){
                        element.width = 2;
                    } else {
                        element.width = 2;
                    } 
                }
            // si l'element n'a pas voisin
            } else if( !(element.voisins && element.voisins.length)) {
                element.width = 1;
            }
        });

        // position
        dataSource.forEach( element => {
            element.position = this.findposition(element, dataSource);
        });

        this.setState({dataSource});
    }

    // Define for each windows
    findposition( element, dataSource) {
        if( element.width === 1) {
            return 1;
        } else if(element.width === 2) {
            // si le voisin est deja positionné
            if(dataSource[element.voisins[0]-1].position) {
                if(dataSource[element.voisins[0]-1].position === 1) {
                    return 2;
                } else {
                    return 1;
                }  
            // Si le voisin n'est pas positionné
            } else {
                return 1;
            }
        } else if(element.width === 3) {
            let tabPos = [1,2,3];
            // donnez la position restante
            element.voisins.forEach( voisin => {
                if( dataSource[voisin-1].position ) {
                    tabPos.splice(tabPos.findIndex( value => value === dataSource[voisin-1].position),1);
                }
            });

            return Math.min(...tabPos);
        }
    }

    render() {
        const { dataSource } = this.state;
        return (
            <div id="container" className="calendar-container">
                {dataSource && <div>
                    {dataSource.map(element => {
                        let topValue, heightValue, widthValue, leftValue;
                        topValue = (element.startTime * 100) / 1440 ;
                        heightValue = (element.duration * 100) / 1440;
                        widthValue = (120 / element.width) - 4;
                        if( element.width === 3) {
                            if( element.position === 1) 
                                leftValue =  20;
                            else if( element.position === 2)
                                leftValue = 60;
                            else if( element.position === 3)
                                leftValue = 100;
                        } else if(element.width === 2) {
                            if( element.position === 1) 
                                leftValue =  20;
                            else if( element.position === 2)
                                leftValue = 80;
                        } else if( element.width === 1) {
                            leftValue = 20;
                        }
                        
                        // style for div
                        const style = {
                            position: "absolute",
                            top : topValue + "%",
                            left : leftValue + "px",
                            height : heightValue + "vh",
                            width : widthValue + "px",
                            backgroundColor : "#FFFFFF",
                            border : "1px dashed #000000"                        
                        }

                        return <div style={style} className=""></div>
                    })}
                </div>} 
            </div>
        );
    }
}

export default Calendar;
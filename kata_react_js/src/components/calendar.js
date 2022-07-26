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
        // this.drawWindows = this.drawWindows.bind(this);
    }

    componentDidMount() {
        const data = this.props.Data;

        this.buildDatasource(data);

        this.setState({ data });
    }

    buildDatasource(data) {
        let dataSource = [];

        // ajout de nouveaux attibuts startTime(conversion de start en minutes), endTime(startTime + duration) dans l'objet dataSource
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

        //width
        dataSource.forEach( element => {
            if(element.voisins && element.voisins.length && !element.width) {
                // cas avec plus de deux voisins
                if(element.voisins.length >= 2) {
                    element.width = 3;
                    element.voisins.forEach( voisin => dataSource[voisin-1].width = 3);
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

    findposition( element, dataSource) {
        if( element.width === 1) {
            return 1;
        } else if(element.width === 2) {
            if(dataSource[element.voisins[0]-1].position) {
                if(dataSource[element.voisins[0]-1].position === 1) {
                    return 2;
                } else {
                    return 1;
                }     
            } else {
                return 1;
            }
        } else if(element.width === 3) {
            let tabPos = [1,2,3];
            // let pos = 1;
            element.voisins.forEach( voisin => {
                if( dataSource[voisin-1].position ) {
                    tabPos.splice(tabPos.findIndex( value => value === dataSource[voisin-1].position),1);
                }
            });

            return Math.min(...tabPos);
        }
    }

    // drawWindows(dataSource) {
    //     // const dataSource = this.state.dataSource;
    //     // let elements = [];

    //     if(dataSource) {
    //         dataSource.map( element => {
    //             // let iDiv = document.createElement('div');
    //             // iDiv.id = element.id;
    //             // iDiv.style.position = "absolute";
    //             // iDiv.style.top = "50%";
    //             // iDiv.style.let = "50%";
    //             // document.getElementById("container").appendChild(iDiv);

    //             // define top, height, width value for windows
    //             let topValue = (element.startTime*100) / 1440 ;
    //             let heightValue = (element.duration*100) /1440;

    //             // style for div
    //             const style = {
    //                 position: "absolute",
    //                 backgroundColor : "#00000",
    //                 top : topValue + "%",
    //                 left : "0%",
    //                 height : heightValue + "%"
    //             }
                
    //             return <div className="">{element.id}</div>
    //         })
    //     }
    // }

    render() {

        const { dataSource } = this.state;
        return (
            <div id="container" className="calendar-container">
                {dataSource && <div>
                    {dataSource.map(element => {
                        let topValue, heightValue, widthValue, leftValue;
                        topValue = (element.startTime*100) / 1440 ;
                        heightValue = (element.duration*100) /1440;
                        widthValue = 120/element.width - 4;
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

                        return <div style={style} className="">{element.id}</div>
                    })}
                </div>}
                    
            </div>
        );
    }
}

export default Calendar;
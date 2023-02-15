const btn = document.querySelector('button');
const select = document.querySelector('select');
const checkbox = document.querySelector('#checkbox');
const sidebar = document.querySelector('#sidebar')

sidebar.addEventListener('click', () => {
    navigator.clipboard.writeText(sidebar.innerText);
    alert('Información copiada');
})

btn.addEventListener('click', () => {
    const { value } = select;
    const { checked } = checkbox;
    if(value){
        if( ['marker', 'circleMarker'].includes(value) ){
            const data = generarPuntos(1);
            crearCapa(data.flat(), value, checked)
        }
        else if( value === 'polygon' ){
            const data = generarPuntos(4);
            crearCapa(data, value, checked)
        }
        else if( value === 'polyline' ){
            const data = generarPuntos(7);
            crearCapa(data, value, checked)
        }
    }
});
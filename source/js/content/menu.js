var currentPos;
var wrapper;
export default {
    show : (pos) => {
        currentPos = pos;
        React.render(
            buildUI(pos),
            getWrapper());
        document.body.appendChild(getWrapper());
    },
    hide : () => {

    }
}

function getWrapper(){
    if(wrapper){
        return wrapper;
    }
    wrapper = document.createElement('div');
    wrapper.className = 'theseed';
    return wrapper;
}
function buildUI(pos){
    return (
        <div className="wrapper-pos" style={{
                left : pos.x + 'px',
                bottom : (-pos.y) + 'px',
                maxHeight : (pos.y - 10) + 'px'
            }}>
            <ul className="menu menu-main">
                <li className="item item-main"><em className="ti-eye"></em></li>
                <li className="item item-main"><em className="ti-eye"></em></li>
                <li className="item item-main"><em className="ti-eye"></em></li>
                <li className="item item-main"><em className="ti-eye"></em></li>
                <li className="item item-main"><em className="ti-eye"></em></li>
            </ul>
        </div>
    );
}
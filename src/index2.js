import { h, mount, $and, $if, $or } from './framework';

const UxInput = ({
  attrs: { name, label, placeholder, type, value, oninput }
}) => {
  return (
    <div class="uxInput">
      <label for={ name }>{ label }</label>
      <input
        type={type || text}
        placeholder={placeholder || ''}
        name={name}
        id={name}
        value={value}
        oninput={oninput}
      />
    </div>
  );
};

const Test = () => {
  return [ ...Array(10000).keys() ].map( (x) => (
    <div>{ x }</div>
  ));
}

const Example4 = ({ attrs, useState } = {}) => {
  const [ state, updateState ] = useState({
    name: '',
    count: 0,
    color: 'green',
    showColors: true
  });

  const toggleColorOptions = (e) => state.showColors = e.target.checked;
  const incrementClicks = () => state.count++;
  const updateName = (e) => state.name = e.target.value;
  const selectColor = (e) => state.color = e.target.value;

  var buttonStyle = () => ({
    background: state.color,
    color: 'white',
    border: `5px solid ${state.color}`
  });

  var colors = ['red', 'orange', 'green', 'purple', 'black'];
  return (
    <div>
      <label for="name">Your name</label>
      <br />
      <UxInput type="text" name="name" value={() => state.name} oninput={updateName} />
      <p> Hello { () => state.name || 'John Doe' }! You have clicked { () => state.count } time{ () => state.count !== 1 ? 's' : ''} on the {() => state.color} button. </p>
      <button style={buttonStyle} onclick={incrementClicks}> Increment! </button>
      <p>
        <label>
          <input type="checkbox" checked={() => state.showColors} oninput={ toggleColorOptions }/>
          Show color options
        </label>
      </p>
      <p>
        { $and(() => state.showColors,
          colors.map( color => <label>
            <input
              type="radio"
              value={color}
              checked={() => color === state.color ? 'checked' : null}
              name="color"
              id={color}
              onchange={selectColor}
            />
            { color }
          </label>
        ))}
      </p>
    </div>
  );
};

console.time()
mount(<div style={ () => ({ border: '4px solid #177fb6', padding: '20px' })}><Example4 /></div>, document.body);
// mount(<Test />, document.body);
console.timeEnd()

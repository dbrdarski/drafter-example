import { h, mount, $and, $if, $or } from './framework';

const Wrapper = ({ children }) => {
  console.log('Rendering <Wrapper />')
  return (
    <div style={ () => ({ border: '4px solid #177fb6', padding: '20px' })}>
      { children }
    </div>
  );
}

const UxInput = ({
  attrs: { name, label, placeholder, type, value, oninput }
}) => {
  console.log("Rendering <UxInput! />")
  return (
    <div class="uxInput">
      <label for={ name }>{ label }</label>
      <br />
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

const Example4 = ({ attrs, useState, useEffect, computed } = {}) => {

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

  console.log("Rendering <Example4 />")

  return (
    <div>
      <UxInput
        type="text"
        name="name"
        label="Your name"
        value={() => state.name}
        oninput={updateName}
      />
      <p>
        Hello { () => state.name || 'John Doe' }! You have clicked { () => state.count } time{ () => state.count !== 1 ? 's' : ''} on the {() => state.color} button.
      </p>
      <button
        style={buttonStyle}
        onclick={incrementClicks}
      > Increment! </button>
      <p>
        <label>
          <input type="checkbox" checked={() => state.showColors} oninput={ toggleColorOptions }/>
          Show color options
        </label>
      </p>
      <p>
        { $and(() => state.showColors,
          attrs.colors.map( color => <label>
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
        )) }
      </p>
    </div>
  );
};

// const Test = () => {
//   return [ ...Array(10000).keys() ].map( (x) => (
//     <div>{ x }</div>
//   ));
// }

console.time()

mount(<Wrapper><Example4 colors={['red', 'orange', 'green', 'purple', 'black']} /></Wrapper>, document.body);
// mount(<Test />, document.body);
console.timeEnd()

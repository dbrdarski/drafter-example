import { h, mount, $and, $if, $or } from './framework';

const Wrapper = ({ children }) => {
  console.log('Rendering <Wrapper />')
  return (
    <div style={() => ({ border: '4px solid #177fb6', padding: '20px' })}>
      { children }
    </div>
  );
}

const UxInput = ({
  attrs: { name, label, placeholder, type, ...rest }
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
        {...rest}
      />
    </div>
  );
};

const Timer = ({ useValue, useComputed, useEffect }) => {
  const [ counter, setCounter ] = useValue(0);
  const increment = () => { setCounter(v => v + 1) };
  const counterDisplay = useComputed({ counter }, ({ counter }) => {
    const reversed = String(counter).split('').reverse().join('');
    const sum = counter + Number(reversed);
    return `${counter} | ${sum} | ${reversed}`;
  });

  const interval = setInterval(increment, 1000);

  useEffect({ counter }, ({ counter }) => {
    document.title = `You clicked ${counter} times`;
  })

  useEffect(false, () => {
    console.log('START!!!')
    return () => {
      console.log('END!!!!')
      document.title = 'Thank you for using Ryan Air!'
      clearInterval(interval);
    }
  });

  console.log("Rendering <Timer />")

  return (
    <h2>{ counterDisplay }</h2>
  );
};

const Main = ({ attrs, useState, useEffect, useRef } = {}) => {
  const inputRef = useRef();
  console.log({ inputRef })
  const [ state, updateState ] = useState({
    name: '',
    count: 0,
    color: 'green',
    showColors: true
  });

  window.state = state;

  // useEffect({
  //   counter
  // }, ({
  //   counter
  // }) => {
  //   document.title = `You clicked ${counter} times`;
  // });
  //
  const toggleColorOptions = (e) => state.showColors = e.target.checked;
  const incrementClicks = () => {
    inputRef().focus();
    state.count++;
  };
  const updateName = (e) => state.name = e.target.value;
  const selectColor = (e) => state.color = e.target.value;

  var buttonStyle = () => ({
    background: state.color,
    color: 'white',
    border: `5px solid ${state.color}`
  });

  console.log("Rendering <Main />")

  return (
    <div>
      <UxInput
        type="text"
        name="name"
        ref={inputRef}
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
        { $if(() => state.showColors,
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
        ), <Timer />) }
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

mount(<Wrapper>
  <Main colors={['red', 'orange', 'green', 'purple', 'black']} />
</Wrapper>, document.body);
// mount(<Test />, document.body);
console.timeEnd()

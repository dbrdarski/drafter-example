import { h, mount, $and, $if, $or } from './framework';

const UxInput = ({
  attrs: { name, label, placeholder, type, value, oninput }
}) => {
  console.log("RENDER INPUT!!!!")
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

// class Example3 {
//   state = {
//     name: '',
//     counter: 0,
//     color: 'green',
//     showColors: true
//   };
//
//   @useEffect()
//   updatePageTitle ({ state }) {
//     document.title = `You clicked ${state.count} times`
//   }
//
//   @computed()
//   buttonStyle ({ style }) {
//     return {
//       background: state.color,
//       color: 'white',
//       border: `5px solid ${state.color}`
//     }
//   }
//
//   toggleColorOptions = (e) => this.state.showColors = e.target.checked
//   incrementClicks = () => this.state.count++
//   updateName = (e) => this.state.name = e.target.value
//   selectColor = (e) => this.state.color = e.target.value
//
//   view () {
//     return (
//       <div>
//         <label for="name">Your name</label>
//         <br />
//         <UxInput type="text" name="name" value={() => this.state.name} oninput={updateName} />
//         <p> Hello { () => this.state.name || 'John Doe' }! You have clicked { () => this.state.count } time{ () => this.state.count !== 1 ? 's' : ''} on the {() => this.state.color} button. </p>
//         <button style={buttonStyle} onclick={incrementClicks}> Increment! </button>
//         <p>
//           <label>
//             <input type="checkbox" checked={() => this.state.showColors} oninput={ toggleColorOptions }/>
//             Show color options
//           </label>
//         </p>
//         <p>
//           { $and(() => this.state.showColors,
//             colors.map( color => <label>
//               <input
//                 type="radio"
//                 value={color}
//                 checked={() => color === this.state.color ? 'checked' : null}
//                 name="color"
//                 id={color}
//                 onchange={selectColor}
//               />
//               { color }
//             </label>
//           ))}
//         </p>
//       </div>
//     );
//   }
// }

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

  var colors = ['red', 'orange', 'green', 'purple', 'black'];
  console.log("RENDER 4!!!!");
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
